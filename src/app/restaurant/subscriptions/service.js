const { moment, errors, Exception } = require("../../../utils");
const sequelize = require("../../../database");
const { Op } = require("sequelize");
const db = sequelize.models;

class RestaurantsSubscription {
  constructor(data) {}

  static async create(user, subscriptionId, paymentMethod, token) {
    const restaurantId = user.restaurantId;
    const [subscription, lastSubscription] = await Promise.all([
      db.Subscription.findOne({
        where: { id: subscriptionId },
        attributes: ["id", "price", "discount", "duration", "durationUnit"],
        include: {
          as: "restaurants",
          required: false,
          model: db.RestaurantsSubscription,
          where: { restaurantId, status: { [Op.not]: db.RestaurantsSubscription.STATUS.pending } },
          limit: 1,
          order: [["expireAt", "desc"]],
        },
      }),
      db.RestaurantsSubscription.findOne({
        where: { restaurantId, status: { [Op.not]: db.RestaurantsSubscription.STATUS.pending } },
        order: [["expireAt", "desc"]],
      }),
    ]);
    if (!subscription) throw new Exception(errors.Subscription_Not_Found);

    if (subscription.restaurants.length) {
      const sameLastSub = subscription.restaurants[0];
      if (moment(sameLastSub.expireAt).diff(new Date(), "days") > 14) throw new Exception(errors.RestaurantSubscription_Spam);
    }

    let price = subscription.price;
    if (subscription.discount > 0) price *= subscription.discount;

    const time = Math.max(new Date(), lastSubscription?.expireAt);
    const expireAt = moment(time).add(subscription.duration, subscription.durationUnit);

    const result = await db.RestaurantsSubscription.create({
      token,
      price,
      restaurantId,
      subscriptionId,
      paymentMethod,
      expireAt,
    });

    return result;
  }

  static async getById(user, id, lang) {
    const exclude = [];
    const scope = { method: ["localization", { lang, exclude, description: true }] };

    let result = await db.RestaurantsSubscription.findOne({
      where: { id, restaurantId: user.restaurantId, status: { [Op.not]: db.RestaurantsSubscription.STATUS.pending } },
      attributes: { exclude: ["restaurantId", "subscriptionId"] },
      include: [{ model: db.Subscription.scope(scope) }],
    });

    if (!result) throw new Exception(errors.RestaurantSubscription_Not_Found);
    result = result.get({ plain: true });
    if (result.status < new Date()) result.status = db.RestaurantsSubscription.expired;

    return { data: result };
  }

  static async getAll(user, filters, { offset, limit, total }, lang) {
    const exclude = [];
    const scope = { method: ["localization", { lang, exclude, description: false }] };
    const query = {
      where: { restaurantId: user.restaurantId, status: { [Op.not]: db.RestaurantsSubscription.STATUS.pending } },
      attributes: { exclude: ["restaurantId"] },
      include: [{ model: db.Subscription.scope(scope) }],
      offset,
      limit,
      order: [["id", "desc"]],
    };

    const result = await db.RestaurantsSubscription.customFind(query, total);
    result.data = result.data.map((val) => {
      val = val.get({ plain: true });

      if (val.status < new Date()) val.status = db.RestaurantsSubscription.expired;
      val.subscription = val.subscription.name;

      return val;
    });

    return result;
  }
}

module.exports = RestaurantsSubscription;
