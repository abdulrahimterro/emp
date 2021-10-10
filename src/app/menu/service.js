const { assetsPath } = require("../../../configs");
const { Exception, errors, fileUtil } = require("../../utils");
const sequelize = require("../../database");
const { Op, literal } = require("sequelize");

const db = sequelize.models;

class Menu {
  constructor(data) {
    this.arName = data.arName;
    this.enName = data.enName;
    this.currency = data.currency;
    this.tablesCount = data.tablesCount;
    this.location = data.location;
    this.image = data.image ? null : undefined;
  }

  async create(user, file) {
    return await sequelize.transaction(async (transaction) => {
      this.restaurantId = user.restaurantId;

      if (file) this.image = fileUtil.uri(assetsPath.menu.image, file);

      this.tables = [];
      for (let i = 1; i <= this.tablesCount; i++) this.tables.push({ number: i, restaurantId: user.restaurantId });

      let [menu, users] = await Promise.all([
        db.Menu.create(this, { include: db.Table }),
        db.User.findAll({
          attributes: ["id"],
          where: { restaurantId: user.restaurantId },
          include: [{ where: { id: 1 }, model: db.Permission }],
        }),
      ]);
      const userIds = new Set(users.map((val) => val.id));
      userIds.add(user.id);
      await menu.setUsers([...userIds]);
      if (file) await fileUtil.save(this.image, file.buffer);

      return { data: { id: menu.id } };
    });
  }

  async update(user, id, file) {
    await sequelize.transaction(async (transaction) => {
      const menu = await db.Menu.findOne({ where: { id, restaurantId: user.restaurantId } });
      if (!menu || !user.menus.includes(Number(id))) throw new Exception(errors.Menu_Not_Found);

      if (file) this.image = fileUtil.uri(assetsPath.menu.image, file);

      const tableConditions = { menuId: id, restaurantId: user.restaurantId };
      if (this.tablesCount) {
        const tablesCount = await db.Table.count({ where: tableConditions });
        if (this.tablesCount > tablesCount) {
          const [restored] = await db.Table.update(
            { deletedAt: null },
            { paranoid: false, where: { ...tableConditions, number: { [Op.lte]: this.tablesCount } } }
          );

          if (restored + tablesCount < this.tablesCount) {
            const tables = [];
            for (let i = tablesCount + restored + 1; i <= this.tablesCount; i++) tables.push({ number: i, ...tableConditions });
            await db.Table.bulkCreate(tables);
          }
        } else if (this.tablesCount < tablesCount)
          await db.Table.destroy({ where: { ...tableConditions, number: { [Op.gt]: this.tablesCount } } });
      }

      await db.Menu.update(this, { where: { id, restaurantId: user.restaurantId } });
      if ((this.image || this.image === null) && menu.image) await fileUtil.delete(menu.image);
      if (file) await fileUtil.save(this.image, file.buffer);
    });
  }

  static async delete(user, id) {
    await sequelize.transaction(async (transaction) => {
      if (!user.menus.includes(id)) throw new Exception(errors.Menu_Not_Found);
      let categoryIds = await db.Category.findAll({ attributes: ["id"], where: { menuId: id } });
      categoryIds = categoryIds.map((val) => val.id);

      const [rows] = await Promise.all([
        db.Menu.destroy({ where: { id, restaurantId: user.restaurantId } }),
        db.Table.destroy({ where: { menuId: id } }),
        db.Category.destroy({ where: { menuId: id } }),
        db.Dish.destroy({ where: { categoryId: categoryIds } }),
      ]);
      if (!rows) throw new Exception(errors.Menu_Not_Found);
    });
  }

  static async getById(user, id, lang) {
    if (user && !user.menus.includes(Number(id))) throw new Exception(errors.Menu_Not_Found);
    const exclude = ["restaurantId", "menuId", "deletedAt", "iconId"];
    const scope = user ? {} : { method: ["localization", { lang, exclude }] };
    const userConditions = user ? { restaurantId: user.restaurantId } : {};

    let result = await db.Menu.scope(scope).findOne({
      attributes: {
        exclude,
        include: [[literal("(SELECT COUNT(tables.id) FROM tables WHERE tables.menu_id = Menu.id)"), "tablesCount"]],
      },
      where: { id, ...userConditions },
      include: [
        {
          model: db.Category.scope({ method: ["localization", { lang, exclude }] }),
          include: db.CategoryIcon.scope({ method: ["localization", { lang }] }),
        },
      ],
    });
    if (!result) throw new Exception(errors.Menu_Not_Found);
    return { data: result };
  }

  static async getAll(user, filters, { offset, limit, total }, lang) {
    const exclude = ["restaurantId", "image", "location", "currency", "createdAt", "updatedAt", "deletedAt"];
    const conditions = (() => {
      const result = user ? { restaurantId: user.restaurantId, id: user.menus } : {};

      if (filters.name) conditions[`${lang}Name`] = { [Op.like]: `%${filters.name}%` };
      if (filters.restaurantId) conditions["restaurantId"] = filters.restaurantId;

      return result;
    })();

    const query = { attributes: { exclude }, where: conditions, offset, limit };

    const result = await db.Menu.scope({ method: ["localization", { lang, exclude }] }).customFind(query, total);
    return result;
  }

  static async getTables(user, id) {
    const result = await db.Table.findAll({
      attributes: ["code", "number"],
      where: { restaurantId: user.restaurantId, menuId: id },
      order: [["number", "asc"]],
    });
    return { data: result };
  }
}

module.exports = Menu;
