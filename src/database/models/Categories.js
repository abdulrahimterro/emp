const { DataTypes } = require("sequelize");
const { BaseModel, enums } = require("./embedded");
const { errors, Exception } = require("../../utils");
const sequelize = require("../sequelize");

class Category extends BaseModel {
  static STATUS = enums.category.status;

  static initialize() {
    Category.init(
      {
        enName: { type: DataTypes.STRING(100), allowNull: false },
        arName: { type: DataTypes.STRING(100), allowNull: false },
        status: { type: DataTypes.ENUM(_.values(Category.STATUS)), defaultValue: Category.STATUS.active },
      },
      {
        sequelize,
        name: { singular: "category", plural: "categories" },
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
    const { Menu, CategoryIcon, Dish } = sequelize.models;
    this.belongsTo(Menu, { foreignKey: { name: "menuId", allowNull: false }, onDelete: "CASCADE" });
    this.belongsTo(CategoryIcon, { foreignKey: { name: "iconId" }, onDelete: "SET NULL" });

    this.hasMany(Dish, { foreignKey: { name: "categoryId", allowNull: false }, onDelete: "CASCADE" });
  }

  static async checkPermission(user, id) {
    const db = sequelize.models;
    const category = await this.findOne({
      attributes: ["id", "menuId"],
      where: { id },
      include: [{ required: true, attributes: ["id"], model: db.Menu, where: { restaurantId: user.restaurantId } }],
    });
    if (!category || !user.menus.includes(category.menuId)) throw new Exception(errors.Category_Not_Found);

    return category;
  }
}

module.exports = Category;
