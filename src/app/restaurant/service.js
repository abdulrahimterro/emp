const { assetsPath } = require("../../../configs");
const { errors, fileUtil, Exception, moment } = require("../../utils");
const sequelize = require("../../database");
const { Op } = require("sequelize");
const User = require("../user/service");

const db = sequelize.models;

class Restaurant {
  constructor(data) {
    this.enName = data.enName;
    this.arName = data.arName;
    this.logo = data.logo ? null : undefined;
    this.user = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      birthDate: data.birthDate,
      permissions: 1,
      status: db.User.STATUS.active,
      isSuper: true,
    };
  }

  async signup(file) {
    await sequelize.transaction(async (transaction) => {
      if (file) this.logo = fileUtil.uri(assetsPath.restaurant.logo, file);
      const [restaurant, subscription] = await Promise.all([db.Restaurant.create(this), db.Subscription.findByPk(1)]);
      if (!subscription) throw new Exception(errors.Subscription_Not_Found);
      this.user.restaurantId = restaurant.id;
      await Promise.all([
        new User(this.user).create(),
        db.RestaurantsSubscription.create({
          restaurantId: restaurant.id,
          status: db.RestaurantsSubscription.STATUS.active,
          subscriptionId: 1,
          price: subscription.price,
          expireAt: moment(new Date()).add(subscription.duration, subscription.durationUnit),
        }),
      ]);

      if (file) await fileUtil.save(this.logo, file.buffer);
    });
  }

  async update(user, file) {
    await sequelize.transaction(async (transaction) => {
      if (file) this.logo = fileUtil.uri(assetsPath.restaurant.logo, file);
      const [result] = await Promise.all([
        db.Restaurant.findOne({ where: { id: user.restaurantId } }),
        db.Restaurant.update(this, { where: { id: user.restaurantId } }),
      ]);
      if (!result) throw new Exception(errors.Restaurant_Not_Found);
      if ((this.logo || this.logo === null) && result.logo) await fileUtil.delete(result.logo);
      if (file) await fileUtil.save(this.logo, file.buffer);
    });
  }

  static async getAll(filters, { offset, limit, total }, lang) {
    const conditions = (() => {
      const result = {};
      if (filters.name) result[`${lang}Name`] = { [Op.like]: `%${filters.name}%` };
      return result;
    })();

    const exclude = ["deletedAt"];

    const query = {
      attributes: { exclude },
      where: conditions,
      offset,
      limit,
      order: [["id", "desc"]],
    };

    const result = await db.Restaurant.scope({ method: ["localization", { lang, exclude }] }).customFind(query, total);

    return result;
  }

  static async getById(user, id, lang) {
    const exclude = ["deletedAt"];
    const scope = user ? {} : { method: ["localization", { lang, exclude }] };

    let result = await db.Restaurant.scope(scope).findOne({ where: { id }, attributes: { exclude } });
    if (!result) throw new Exception(errors.Restaurant_Not_Found);
    return { data: result };
  }
}

module.exports = Restaurant;
