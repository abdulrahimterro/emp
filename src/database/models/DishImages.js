const { domain } = require("../../../configs");
const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class DishImage extends BaseModel {
  static initialize() {
    DishImage.init(
      {
        url: {
          type: DataTypes.TEXT,
          allowNull: false,
          set(value) {
            this.setDataValue("url", domain + "/" + value);
          },
        },
        default: { type: DataTypes.BOOLEAN, defaultValue: false },
      },
      {
        sequelize,
        name: { singular: "image", plural: "images" },
        timestamps: false,
        underscored: true,
      }
    );
  }

  static associate() {
    const { Dish } = sequelize.models;
    this.belongsTo(Dish, { foreignKey: { name: "dishId", allowNull: false }, onDelete: "CASCADE" });
  }
}

module.exports = DishImage;
