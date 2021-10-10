const sequelize = require("../../database");
const { errors, Exception } = require("../../utils");
const { Op } = require("sequelize");
const ClientService = require("../client/service");

const db = sequelize.models;

class Table {
  constructor(data) {
    this.status = data.status;
  }

  static async create(menuId, count) {}

  async update(user, id) {
    const userConditions = user ? { restaurantId: user.restaurantId } : {};
    await sequelize.transaction(async (transaction) => {
      const table = await db.Table.findOne({
        where: { id, ...userConditions },
        include: [{ required: false, where: { checkout: { [Op.is]: null } }, model: db.Client }],
      });
      if (!table || (user && !user.menus.includes(table.menuId))) throw new Exception(errors.Table_Not_Found);

      // this case mean checkout
      if (this.status === db.Table.STATUS.active && table.clients.length) {
        const clientId = table.clients[0].id;
        await new ClientService({ checkout: new Date() }).update(clientId);
      }
      await db.Table.update(this, { where: { id } });
      //raise socket event
      const { menuId } = table;
      io.to("table:" + menuId).emit("table-update", { id, ...this });
    });
  }

  static async getByCode(code, lang) {
    const exclude = ["restaurantId", "menuId", "iconId", "createdAt", "updatedAt", "deletedAt", "location", "status"];
    const scope = { method: ["localization", { lang, exclude }] };

    let result = await db.Table.findOne({
      where: { code },
      attributes: ["id", "number", "status", "menuId"],
      include: [
        { required: true, model: db.Restaurant.scope(scope) },
        {
          required: true,
          model: db.Menu.scope(scope),
          include: [
            {
              model: db.Category.scope(scope),
              where: { status: db.Category.STATUS.active },
              include: db.CategoryIcon.scope(scope),
            },
          ],
        },
      ],
    });
    if (!result) throw new Exception(errors.Table_Not_Found);
    result = result.get({ plain: true });

    const table = _.pick(result, ["id", "number", "status"]);
    result.table = table;
    result.categories = result.menu.categories;

    result = _.omit(result, ["id", "menuId", "number", "status", "menu.categories"]);
    return result;
  }

  static async getOrders(id, lang) {
    let result = await db.Table.findByPk(id, {
      attributes: ["id", "number"],
      include: [
        {
          required: false,
          attributes: ["id", "orderNumber"],
          where: { checkout: { [Op.is]: null } },
          model: db.Client,
          include: [
            {
              where: { status: { [Op.ne]: db.Order.STATUS.canceled } },
              attributes: ["id", "amount", "note", "status", "price"],
              model: db.Order,
              include: [
                {
                  attributes: ["id", [`${lang}_name`, "name"]],
                  model: db.Dish,
                  include: [
                    { attributes: { exclude: ["dishId"] }, model: db.DishImage, where: { default: true } },
                    { attributes: ["id", [`${lang}_name`, "name"]], model: db.Category },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!result?.clients?.length) return { data: { clientId: null, orderNumber: null, orders: [] } };
    result = result.get({ plain: true });

    const clientId = result.clients[0].id;
    const orderNumber = result.clients[0].orderNumber;
    const orders = result.clients[0].orders;

    return { data: { clientId, orderNumber, orders } };
  }

  static async getAll(user, filters, { offset, limit, total }) {
    if (!user.menus.includes(Number(filters.menuId))) throw new Exception(errors.Menu_Not_Found);

    const conditions = (() => {
      const result = { type: db.Table.TYPE.inside };

      if (filters.menuId) result["menuId"] = filters.menuId;
      if (filters.status) result["status"] = filters.status;

      return result;
    })();

    const query = { attributes: { exclude: ["type", "code", "menuId", "restaurantId"] }, where: conditions, offset, limit };
    const result = await db.Table.customFind(query, total);

    return result;
  }
}

module.exports = Table;
