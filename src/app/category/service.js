const sequelize = require("../../database");
const { errors, Exception } = require("../../utils");
const { Op } = require("sequelize");

const db = sequelize.models;

class Category {
  constructor(data) {
    this.arName = data.arName;
    this.enName = data.enName;
    this.status = data.status;
    this.iconId = data.iconId;
    this.menuId = data.menuId;
  }

  async create(user) {
    return await sequelize.transaction(async (transaction) => {
      const [category] = await Promise.all([db.Category.create(this), db.Menu.checkPermission(user, this.menuId)]);
      return { data: { id: category.id } };
    });
  }

  async update(user, id) {
    await sequelize.transaction(async (transaction) => {
      const [category] = await Promise.all([
        //check permission to category
        db.Category.checkPermission(user, id),
        // update
        db.Category.update(this, { where: { id } }),
      ]);
      io.to("category:" + category.menu.id).emit("category-update", { id, ...this });
    });
  }

  static async delete(user, id) {
    await sequelize.transaction(async (transaction) => {
      //check permission to category
      const category = await db.Category.checkPermission(user, id);
      await Promise.all([
        //delete
        db.Category.destroy({ where: { id } }),
        db.Dish.destroy({ where: { categoryId: id } }),
      ]);
      io.to("category:" + category.menu.id).emit("category-delete", { id });
    });
  }

  static async getById(user, id, lang) {
    const exclude = ["menuId", "iconId"];
    const scope = user ? {} : { method: ["localization", { lang, exclude }] };
    const userConditions = user ? { restaurantId: user.restaurantId } : {};
    const query = {
      attributes: { exclude },
      where: { id },
      include: [{ model: db.CategoryIcon.scope({ method: ["localization", { lang }] }) }],
    };
    if (user) query.include.push({ attributes: [], model: db.Menu, where: userConditions });

    let result = await db.Category.scope(scope).findOne(query);
    if (!result) throw new Exception(errors.Category_Not_Found);

    return { data: result };
  }

  static async getAll(user, filters, { offset, limit, total }, lang) {
    return await sequelize.transaction(async (transaction) => {
      const conditions = (() => {
        const result = {};

        if (filters.name) result[`${lang}Name`] = { [Op.like]: `%${filters.name}%` };
        if (filters.menuId) result["menuId"] = filters.menuId;
        if (filters.id) result["id"] = filters.id;
        if (!user) result["status"] = db.Category.STATUS.active;
        else if (filters.status) result["status"] = filters.status;

        return result;
      })();

      const userConditions = user ? { restaurantId: user.restaurantId } : {};
      const exclude = ["iconId", "menuId", "deletedAt"];

      const query = {
        attributes: { exclude },
        where: conditions,
        include: db.CategoryIcon.scope({ method: ["localization", { lang }] }),
        offset,
        limit,
        order: [["id", "desc"]],
        distinct: true,
      };

      const [result, menu] = await Promise.all([
        db.Category.scope({ method: ["localization", { lang, exclude }] }).customFind(query, total),
        db.Menu.findOne({ attributes: ["id"], where: { id: filters.menuId, ...userConditions } }),
      ]);
      if (!menu) throw new Exception(errors.Menu_Not_Found);

      return result;
    });
  }
}

module.exports = Category;
