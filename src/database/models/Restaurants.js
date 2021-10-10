const { domain } = require("../../../configs");
const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class Restaurant extends BaseModel {
  static initialize() {
    Restaurant.init(
      {
        enName: { type: DataTypes.STRING(100), allowNull: false },
        arName: { type: DataTypes.STRING(100), allowNull: false },
        logo: {
          type: DataTypes.TEXT,
          set(value) {
            value ? this.setDataValue("logo", domain + "/" + value) : this.setDataValue("logo", null);
          },
        },
      },
      {
        sequelize,
        name: { singular: "restaurant", plural: "restaurants" },
        paranoid: true,
        underscored: true,
        scopes: {
          localization({ lang, exclude = [] }) {
            return {
              attributes: {
                exclude: ["enName", "arName", ...exclude],
                include: [[`${lang}_name`, "name"]],
              },
            };
          },
        },
      }
    );
  }

  static associate() {
    const { Menu, Table, RestaurantsSubscription, User, Invite, Dish } = sequelize.models;
    this.hasMany(Menu, { foreignKey: { name: "restaurantId", allowNull: false }, onDelete: "CASCADE" });
    this.hasMany(Table, { foreignKey: { name: "restaurantId", allowNull: false }, onDelete: "CASCADE" });
    this.hasMany(RestaurantsSubscription, {
      foreignKey: { name: "restaurantId", allowNull: false },
      onDelete: "CASCADE",
    });
    this.hasMany(User, { foreignKey: { name: "restaurantId", allowNull: true }, onDelete: "CASCADE" });
    this.hasMany(Invite, { foreignKey: { name: "restaurantId", allowNull: false }, onDelete: "CASCADE" });
    this.hasMany(Dish, { foreignKey: { name: "restaurantId", allowNull: false }, onDelete: "CASCADE" });
  }
}

module.exports = Restaurant;
