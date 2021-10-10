const { domain } = require("../../../configs");
const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class CategoryIcon extends BaseModel {
  static initialize() {
    CategoryIcon.init(
      {
        enName: { type: DataTypes.STRING(40) },
        arName: { type: DataTypes.STRING(40) },
        url: {
          type: DataTypes.TEXT,
          allowNull: false,
          set(value) {
            this.setDataValue("url", domain + "/" + value);
          },
        },
      },
      {
        sequelize,
        name: { singular: "icon", plural: "icons" },
        timestamps: false,
        underscored: true,
        scopes: {
          localization({ lang }) {
            return {
              attributes: {
                exclude: ["enName", "arName"],
                include: [[`${lang}_name`, "name"]],
              },
            };
          },
        },
      }
    );
  }

  static associate() {
    const { Category } = sequelize.models;
    this.hasMany(Category, { foreignKey: { name: "iconId", allowNull: false } });
  }
}

module.exports = CategoryIcon;
