const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class Allergy extends BaseModel {
  static associate() {
    const { Dish } = sequelize.models;
    this.belongsToMany(Dish, { through: "dishes_allergies", timestamps: false });
  }

  static initialize() {
    Allergy.init(
      {
        enName: { type: DataTypes.STRING(40) },
        arName: { type: DataTypes.STRING(40) },
      },
      {
        sequelize,
        name: { singular: "allergy", plural: "allergies" },
        timestamps: false,
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
}

module.exports = Allergy;
