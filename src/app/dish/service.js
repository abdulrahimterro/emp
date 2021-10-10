const sequelize = require("../../database");
const { errors, Exception } = require("../../utils");
const { Op } = require("sequelize");
const DishImage = require("./images/service");

const db = sequelize.models;

class Dish {
  constructor(data) {
    this.categoryId = data.categoryId;
    this.arName = data.arName;
    this.enName = data.enName;
    this.arDescription = data.arDescription;
    this.enDescription = data.enDescription;
    this.code = data.code;
    this.price = data.price;
    this.discount = data.discount;
    this.status = data.status;
    this.calories = data.calories;
    this.preparationTime = data.preparationTime;
    this.allergies = data.allergies?.filter((val) => val != 0);
  }

  async create(user, files) {
    return await sequelize.transaction(async (transaction) => {
      const [dish, category] = await Promise.all([
        // create dish
        db.Dish.create({ ...this, restaurantId: user.restaurantId }),
        //check permission to category
        db.Category.checkPermission(user, this.categoryId),
      ]);

      const images = files?.map((val, index) => {
        return new DishImage({ dishId: dish.id, default: !index, file: val });
      });

      const queries = [DishImage.create(images)];
      if (this.allergies) queries.push(dish.setAllergies(this.allergies));
      await Promise.all(queries);

      if (images) await Promise.all(images?.map((val) => val.saveFile()));

      return { data: { id: dish.id } };
    });
  }

  async update(user, id, files) {
    await sequelize.transaction(async (transaction) => {
      const dish = await db.Dish.checkPermission(user, id);
      if (files && dish.images.length + files.length > 4) throw new Exception(errors.DishImages_EXCEED_LIMIT);

      const images = files?.map((val) => {
        return new DishImage({ dishId: id, file: val });
      });

      if (images?.length && !dish.images.length) images[0].default = true;
      const queries = [db.Dish.update(this, { where: { id } }), DishImage.create(images)];
      if (this.allergies) queries.push(dish.setAllergies(this.allergies));

      await Promise.all(queries);
      if (images) await Promise.all(images.map((val) => val.saveFile()));

      /**
       * In case of updating the status of dish to disabled
       * update all 'pending' orders on this dish to 'out of stock'.
       */
      if (this.status == "disabled") {
        const orderConditions = { dishId: id, status: db.Order.STATUS.pending };
        const [orders] = await Promise.all([
          db.Order.findAll({ attributes: ["id"], where: orderConditions }),
          db.Order.update({ userId: user.id, status: db.Order.STATUS.outOfStock }, { where: orderConditions }),
        ]);
        const orderIds = orders.map((val) => val.id);
        if (orderIds.length)
          io.to("order:" + user.restaurantId).emit("order-update", { id: orderIds, status: db.Order.STATUS.outOfStock });
      }
      io.to("dish:" + dish.category.menuId).emit("dish-update", { id, ...this });
    });
  }

  static async delete(user, id) {
    await sequelize.transaction(async (transaction) => {
      const dish = await db.Dish.checkPermission(user, id);
      await db.Dish.destroy({ where: { id } });
      io.to("dish:" + dish.category.menuId).emit("dish-delete", { id });
    });
  }

  static async getById(user, id, lang) {
    const exclude = ["restaurantId", "categoryId", "iconId", "menuId", "deletedAt"];
    const scope = { method: ["localization", { lang, exclude: ["createdAt", "updatedAt", ...exclude] }] };

    let result = await db.Dish.findOne({
      attributes: { exclude },
      where: { id },
      include: [
        {
          model: db.Category.scope(scope),
          include: [{ model: db.CategoryIcon.scope(scope) }, { model: db.Menu, attributes: ["currency"] }],
        },
        { model: db.DishImage, attributes: { exclude: ["dishId"] } },
        { model: db.Allergy.scope(scope), through: { attributes: [] } },
      ],
    });
    if (!result) throw new Exception(errors.Dish_Not_Found);
    result = result.get({ plain: true });
    result.currency = result.category.menu.currency;
    delete result.category.menu;
    return { data: result };
  }

  static async getAll(user, filters, { offset, limit, total }, lang) {
    const userConditions = user ? { restaurantId: user.restaurantId } : {};

    const { dishConditions, categoryConditions } = (() => {
      const dishConditions = {};

      if (filters.name) dishConditions[`${lang}Name`] = { [Op.like]: `%${filters.name}%` };
      if (!user) dishConditions["status"] = db.Dish.STATUS.active;
      if (user && filters.status) dishConditions["status"] = filters.status;
      if (filters.categoryId) dishConditions["categoryId"] = filters.categoryId;
      if (filters.id) dishConditions["id"] = filters.id;

      const categoryConditions = { id: filters.categoryId };
      if (!user) categoryConditions["status"] = db.Category.STATUS.active;

      return { dishConditions, categoryConditions };
    })();

    let { order } = filters;
    if (!order) order = [["id", "desc"]];
    order.forEach((val) => {
      if (val[0] === "name") val[0] = `${lang}Name`;
    });

    const exclude = ["restaurantId", "deletedAt"];

    const query = {
      attributes: { exclude },
      where: dishConditions,
      include: [{ attributes: { exclude: ["dishId"] }, model: db.DishImage }],
      offset,
      limit,
      order,
      distinct: true,
    };

    const [result, category] = await Promise.all([
      db.Dish.scope({ method: ["localization", { lang, exclude, description: false }] }).customFind(query, total),
      db.Category.findOne({
        attributes: ["id"],
        where: categoryConditions,
        include: [{ model: db.Menu, where: userConditions }],
      }),
    ]);
    if (!category) throw new Exception(errors.Category_Not_Found);

    return result;
  }
}

module.exports = Dish;
