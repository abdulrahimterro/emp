const sequelize = require("../../database");
const { Exception, errors } = require("../../utils");
const { Op, fn } = require("sequelize");
const Client = require("../client/service");
const Table = require("../table/service");

const db = sequelize.models;

class Order {
  constructor(data) {
    this.amount = data.amount;
    this.note = data.note;
    this.status = data.status;
  }

  static async create(data, lang) {
    return await sequelize.transaction(async (transaction) => {
      // categories dishes
      const { dishIds, dishesById } = data.dishes.reduce(
        (prev, curr) => {
          prev.dishIds.add(curr.id);
          prev.dishesById[curr.id] = curr;

          return prev;
        },
        { dishIds: new Set(), dishesById: {} }
      );
      if (dishIds.size !== data.dishes.length) throw new Exception(errors.Duplicated_Dish_id);

      const { client, table } = await Client.findOrCreate(data);

      let raiseTableSocket = false;
      if (table.status === db.Table.STATUS.active) {
        table.status = db.Table.STATUS.busy;
        raiseTableSocket = true;
      }

      //get the dishes and change table status
      let [dishes] = await Promise.all([
        db.Dish.findAll({
          attributes: ["id", "enName", "arName", "code", "status", "price", "discount"],
          where: { id: [...dishIds], status: db.Dish.STATUS.active, restaurantId: table.restaurantId },
          include: [
            { required: false, where: { default: true }, model: db.DishImage },
            {
              attributes: ["id", "enName", "arName", "status"],
              where: { status: db.Category.STATUS.active },
              model: db.Category,
              include: { model: db.Menu, attributes: ["id", "currency"] },
            },
          ],
        }),
        table.save(),
      ]);

      const menuIds = [...new Set(dishes.map((val) => val.category.menu.id))];
      if (menuIds.length > 1) throw new Exception(errors.Order_Multiple_Menus);

      dishes.forEach((val) => dishIds.delete(val.id));
      if (dishIds.size) throw new Exception(errors.Order_Dish_Not_Found([...dishIds]));

      // prepare orders
      let orders = dishes.map((val) => ({
        clientId: client.id,
        dishId: val.id,
        price: val.price - val.price * val.discount,
        amount: dishesById[val.id].amount,
        note: dishesById[val.id].note,
      }));

      orders = await db.Order.bulkCreate(orders);

      dishes = dishes.reduce((prev, curr) => {
        prev[curr.id] = _.omit(curr.get({ plain: true }), ["price", "discount"]);
        return prev;
      }, {});

      orders = orders.map((val) => {
        val = val.get({ plain: true });

        val.client = { id: client.id, orderNumber: client.orderNumber, table: { id: table.id, number: table.number } };
        val.dish = dishes[val.dishId];
        val.currency = val.dish.category.menu.currency;
        val = _.omit(val, ["dishId", "clientId", "dish.category.menu"]);
        return val;
      });

      const result = await Table.getOrders(table.id, lang);
      //raise socket events
      io.to("order:" + menuIds[0]).emit("order-create", { orders });
      if (raiseTableSocket) io.to("table:" + menuIds[0]).emit("table-update", { id: table.id, status: table.status });

      return result;
    });
  }

  async update(user, id) {
    await sequelize.transaction(async (transaction) => {
      const userConditions = user ? { restaurantId: user.restaurantId } : {};
      // check order and update
      const [order] = await Promise.all([
        db.Order.findOne({
          where: { id },
          attributes: ["id", "status"],
          include: [
            {
              required: true,
              attributes: ["id"],
              model: db.Client,
              include: [{ attributes: ["menuId"], model: db.Table, where: userConditions }],
            },
          ],
        }),
        db.Order.update(this, { where: { id } }),
      ]);
      if (!order) throw new Exception(errors.Order_Not_Found);
      if (!user && order.status !== db.Order.STATUS.pending) throw new Exception(errors.Order_Invalid_Update(order.status));

      // raise socket event
      const { menuId } = order.client.table;
      io.to("order:" + menuId).emit("order-update", { id, ...this });
    });
  }

  static async getAll(user, filters, { offset, limit, total }, lang) {
    const conditions = (() => {
      const result = _.pick(filters, ["status", "id"]);
      if (filters.from) result["createdAt"] = { [Op.gte]: filters.from };
      if (filters.to) result["createdAt"] = { [Op.lte]: filters.to };
      if (filters.from && filters.to) result["createdAt"] = { [Op.between]: [filters.from, filters.to] };

      return result;
    })();
    const dishConditions = {
      restaurantId: user.restaurantId,
      ..._.pick(filters, "categoryId"),
    };
    const exclude = [
      "preparationTime",
      "price",
      "discount",
      "calories",
      "createdAt",
      "updatedAt",
      "deletedAt",
      "restaurantId",
      "iconId",
      "menuId",
      "categoryId",
    ];
    const scope = { method: ["localization", { lang, exclude, description: false }] };

    const query = {
      where: conditions,
      attributes: { exclude: ["dishId", "userId", "clientId"] },
      include: [
        {
          required: true,
          attributes: ["id", "orderNumber"],
          model: db.Client,
          include: [{ required: true, attributes: ["id", "number"], model: db.Table }],
        },
        {
          model: db.Dish.scope(scope),
          where: dishConditions,
          include: [
            { required: false, where: { default: true }, model: db.DishImage },
            {
              required: true,
              model: db.Category.scope(scope),
              include: { required: true, model: db.Menu, attributes: ["currency"] },
            },
          ],
        },
      ],
      offset,
      limit,
      order: [["id", "asc"]],
      distinct: true,
    };
    let result = await db.Order.customFind(query, total);

    result.data = result.data.map((val) => {
      val = val.get({ plain: true });
      val.currency = val.dish.category.menu.currency;
      delete val.dish.category.menu;
      return val;
    });

    return result;
  }

  static async getById(user, id, lang) {
    const dishConditions = {
      restaurantId: user.restaurantId,
    };
    const exclude = [
      "menuId",
      "price",
      "discount",
      "calories",
      "createdAt",
      "updatedAt",
      "deletedAt",
      "restaurantId",
      "categoryId",
      "iconId",
      "code",
    ];
    const scope = { method: ["localization", { lang, exclude, description: false }] };

    let result = await db.Order.findOne({
      where: { id },
      attributes: { exclude: ["clientId", "dishId", "userId"] },
      include: [
        {
          attributes: ["id", "orderNumber"],
          model: db.Client,
          include: [{ attributes: ["id", "number"], model: db.Table }],
        },
        {
          model: db.Dish.scope(scope),
          required: true,
          where: dishConditions,
          include: [
            { required: false, where: { default: true }, model: db.DishImage },
            {
              model: db.Category.scope(scope),
              include: [{ model: db.CategoryIcon.scope(scope) }, { model: db.Menu, attributes: ["currency"] }],
            },
          ],
        },
      ],
    });
    if (!result) throw new Exception(errors.Order_Not_Found);
    result = result.get({ plain: true });
    result.currency = result.dish.category.menu.currency;
    delete result.dish.category.menu;
    return { data: result };
  }

  static async getStatusCount(user, filters) {
    const conditions = (() => {
      const result = {};
      if (filters.to) result["createdAt"] = { [Op.lte]: filters.to };
      if (filters.from) result["createdAt"] = { [Op.gte]: filters.from };
      if (filters.from && filters.to) result["createdAt"] = { [Op.between]: [filters.from, filters.to] };

      return result;
    })();
    const tableConditions = { restaurantId: user.restaurantId };
    if (filters.menuId) tableConditions["menuId"] = filters.menuId;

    const counts = await db.Order.findAll({
      where: conditions,
      attributes: ["status", [fn("Count", sequelize.col("Order.id")), "count"]],
      raw: true,
      include: [
        {
          required: true,
          attributes: [],
          model: db.Client,
          include: { model: db.Table, where: tableConditions, required: true, attributes: [] },
        },
      ],
      group: "Order.status",
    });

    const result = _.values(db.Order.STATUS).reduce((prev, curr) => {
      prev[curr] = 0;
      return prev;
    }, {});

    counts.forEach((val) => (result[val.status] = val.count));

    return { data: result };
  }
}

module.exports = Order;
