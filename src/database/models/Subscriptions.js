const { DataTypes } = require("sequelize");
const { BaseModel, enums } = require("./embedded");
const sequelize = require("../sequelize");

class Subscription extends BaseModel {
  static UNITS = enums.subscription.units;

  static initialize() {
    Subscription.init(
      {
        enName: { type: DataTypes.STRING(100), allowNull: false },
        arName: { type: DataTypes.STRING(100), allowNull: false },
        duration: { type: DataTypes.INTEGER, allowNull: false },
        durationUnit: { type: DataTypes.ENUM(_.values(Subscription.UNITS)), allowNull: false },
        price: { type: DataTypes.FLOAT, allowNull: false },
        discount: { type: DataTypes.FLOAT, defaultValue: 0 },
        enDescription: { type: DataTypes.TEXT, defaultValue: "" },
        arDescription: { type: DataTypes.TEXT, defaultValue: "" },
      },
      {
        sequelize,
        name: { singular: "subscription", plural: "subscriptions" },
        paranoid: true,
        underscored: true,
        scopes: {
          localization({ lang, exclude = [], description = true }) {
            const include = [[`${lang}_name`, "name"]];
            if (description) include.push([`${lang}_description`, "description"]);
            return {
              attributes: {
                exclude: ["enName", "arName", "enDescription", "arDescription", ...exclude],
                include,
              },
            };
          },
        },
      }
    );
  }

  static associate() {
    const { RestaurantsSubscription } = sequelize.models;
    this.hasMany(RestaurantsSubscription, { foreignKey: { name: "subscriptionId", allowNull: false }, as: "restaurants" });
  }
}

module.exports = Subscription;
