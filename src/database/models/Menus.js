const { domain } = require("../../../configs");
const { errors, Exception } = require("../../utils");
const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class Menu extends BaseModel {
  static initialize() {
    Menu.init(
      {
        enName: { type: DataTypes.STRING(100), allowNull: false },
        arName: { type: DataTypes.STRING(100), allowNull: false },
        currency: { type: DataTypes.STRING(10), allowNull: false },
        location: { type: DataTypes.STRING, allowNull: false },
        image: {
          type: DataTypes.TEXT,
          set(value) {
            value ? this.setDataValue("image", domain + "/" + value) : this.setDataValue("image", null);
          },
        },
      },
      {
        sequelize,
        name: { singular: "menu", plural: "menus" },
        underscored: true,
        paranoid: true,
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
    const { Restaurant, User, Category, Table } = sequelize.models;

    this.belongsTo(Restaurant, {
      foreignKey: { name: "restaurantId", allowNull: false },
      onDelete: "CASCADE",
    });
    this.belongsToMany(User, { through: "user_menu", timestamps: false });

    this.hasMany(Category, { foreignKey: { name: "menuId", allowNull: false }, onDelete: "CASCADE" });
    this.hasMany(Table, { foreignKey: { name: "menuId", allowNull: false }, onDelete: "CASCADE" });
  }

  static async checkPermission(user, id) {
    const Menu = await this.findOne({
      attributes: ["id"],
      where: { id, restaurantId: user.restaurantId },
    });
    if (!Menu) throw new Exception(errors.Menu_Not_Found);
  }
}

module.exports = Menu;
