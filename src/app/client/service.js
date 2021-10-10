const sequelize = require("../../database");
const { errors, Exception } = require("../../utils");
const { Op } = require("sequelize");

const db = sequelize.models;

class Client {
  constructor(data) {
    this.checkout = data.checkout;
    this.tableId = data.tableId;
    this.userId = data.userId;
  }

  async create(table) {
    const lastOrderNumber = await db.Client.findOne({
      attributes: ["id", "orderNumber"],
      include: [{ attributes: ["id"], where: { menuId: table.menuId }, model: db.Table }],
      order: [["id", "desc"]],
    });
    this.orderNumber = lastOrderNumber?.orderNumber + 1 || 1;
    if (this.orderNumber >= 1000) this.orderNumber = 1;

    const result = await db.Client.create(this);

    return result;
  }

  static async findOrCreate(data) {
    const table = await db.Table.findByPk(data.tableId, { attributes: ["id", "status", "menuId", "number", "restaurantId"] });
    if (!table) throw new Exception(errors.Table_Not_Found);

    let client;
    if (table.status !== db.Table.STATUS.active)
      client = await db.Client.findOne({ where: { tableId: table.id, checkout: { [Op.is]: null } } });

    if (!client) client = await new Client(data).create(table);

    return { client, table };
  }

  async update(id) {
    //TODO: check if we need to handle case when checkout and there is active orders
    await db.Client.update(this, { where: { id } });
  }

  static async getAll(user, filters, { offset, limit, total }, lang) {
    const tableConditions = { restaurantId: user.restaurantId };
    const conditions = (() => {
      const result = {};

      if (filters.from) result["createdAt"] = { [Op.gte]: filters.from };
      if (filters.to) result["createdAt"] = { [Op.lte]: filters.to };
      if (filters.from && filters.to) result["createdAt"] = { [Op.between]: [filters.from, filters.to] };

      if (filters.menuId) tableConditions["menuId"] = filters.menuId;

      return result;
    })();

    const query = {
      attributes: { exclude: ["userId", "tableId"] },
      where: conditions,
      include: [{ attributes: ["id", "number"], where: tableConditions, model: db.Table }],
      offset,
      limit,
      distinct: true,
      order: [["id", "desc"]],
    };

    const result = await db.Client.customFind(query, total);

    return result;
  }

  static async getById(user, id, lang) {
    const exclude = [
      "preparationTime",
      "price",
      "discount",
      "calories",
      "createdAt",
      "updatedAt",
      "deletedAt",
      "restaurantId",
      "categoryId",
      "iconId",
      "menuId",
    ];
    const scope = { method: ["localization", { lang, exclude, description: false }] };

    let result = await db.Client.findByPk(id, {
      attributes: { exclude: ["userId", "tableId"] },
      include: [
        { attributes: ["id", "number"], where: { restaurantId: user.restaurantId }, model: db.Table },
        {
          attributes: { exclude: ["userId", "clientId", "dishId"] },
          model: db.Order,
          include: [
            {
              model: db.Dish.scope(scope),
              include: [
                { required: false, where: { default: true }, model: db.DishImage },
                { model: db.Category.scope(scope) },
              ],
            },
          ],
        },
      ],
    });
    if (!result) throw new Exception(errors.Client_Not_Found);

    return { data: result };
  }
}

module.exports = Client;
