const { DataTypes } = require("sequelize");
const { BaseModel, enums } = require("./embedded");
const sequelize = require("../sequelize");

class RestaurantsSubscription extends BaseModel {
  static STATUS = enums.restaurantsSubscription.status;
  static PaymentMethod = enums.restaurantsSubscription.paymentMethod;

  static initialize() {
    RestaurantsSubscription.init(
      {
        token: { type: DataTypes.STRING },
        status: {
          type: DataTypes.ENUM(Object.values(RestaurantsSubscription.STATUS)),
          defaultValue: RestaurantsSubscription.STATUS.pending,
        },
        price: { type: DataTypes.FLOAT, allowNull: false },
        expireAt: { type: DataTypes.DATE, allowNull: false },
        paymentMethod: {
          type: DataTypes.ENUM(Object.values(RestaurantsSubscription.PaymentMethod)),
          defaultValue: RestaurantsSubscription.PaymentMethod.free,
        },
      },
      {
        updatedAt: false,
        sequelize,
        name: { singular: "subscription", plural: "subscriptions" },
        underscored: true,
      }
    );
  }

  static associate() {
    const { Subscription, Restaurant } = sequelize.models;
    this.belongsTo(Subscription, { foreignKey: { name: "subscriptionId", allowNull: false } });
    this.belongsTo(Restaurant, { foreignKey: { name: "restaurantId", allowNull: false } });
  }
}

module.exports = RestaurantsSubscription;
