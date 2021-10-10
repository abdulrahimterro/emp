const { DataTypes } = require("sequelize");
const { BaseModel, enums } = require("./embedded");
const { errors, Exception } = require("../../utils");
const sequelize = require("../sequelize");

class Dish extends BaseModel {
  static STATUS = enums.dish.status;

  static initialize() {
    Dish.init(
      {
        enName: { type: DataTypes.STRING(100), allowNull: false },
        arName: { type: DataTypes.STRING(100), allowNull: false },
        enDescription: { type: DataTypes.TEXT, defaultValue: "" },
        arDescription: { type: DataTypes.TEXT, defaultValue: "" },
        code: { type: DataTypes.STRING(40) },
        price: { type: DataTypes.FLOAT, allowNull: false },
        discount: { type: DataTypes.FLOAT, defaultValue: 0 },
        status: { type: DataTypes.ENUM(_.values(Dish.STATUS)), defaultValue: Dish.STATUS.active },
        calories: { type: DataTypes.INTEGER },
        preparationTime: { type: DataTypes.SMALLINT },
      },
      {
        sequelize,
        name: { singular: "dish", plural: "dishes" },
        underscored: true,
        paranoid: true,
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
    const { Category, Restaurant, Allergy, Order, DishImage } = sequelize.models;
    this.belongsTo(Category, { foreignKey: { name: "categoryId", allowNull: false }, onDelete: "CASCADE" });
    this.belongsTo(Restaurant, {
      foreignKey: { name: "restaurantId", allowNull: false },
      onDelete: "CASCADE",
    });

    this.belongsToMany(Allergy, { through: "dishes_allergies", timestamps: false });
    this.hasMany(Order, { foreignKey: { name: "dishId", allowNull: false } });
    this.hasMany(DishImage, { foreignKey: { name: "dishId", allowNull: false } });
  }

  static async checkPermission(user, id) {
    const db = sequelize.models;
    const dish = await this.findOne({
      attributes: ["id"],
      where: { id },
      include: [
        { model: db.DishImage },
        {
          required: true,
          attributes: ["menuId"],
          model: db.Category,
          include: [{ attributes: [], model: db.Menu, where: { restaurantId: user.restaurantId } }],
        },
      ],
    });
    if (!dish || !user.menus.includes(dish.category.menuId)) throw new Exception(errors.Dish_Not_Found);

    return dish;
  }
}

module.exports = Dish;
