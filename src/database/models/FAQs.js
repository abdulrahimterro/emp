const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class Faq extends BaseModel {
  static initialize() {
    Faq.init(
      {
        enQuestion: { type: DataTypes.STRING(100), allowNull: false },
        arQuestion: { type: DataTypes.STRING(100), allowNull: false },
        enAnswer: { type: DataTypes.TEXT, allowNull: false },
        arAnswer: { type: DataTypes.TEXT, allowNull: false },
      },
      {
        sequelize,
        timestamps: false,
        name: { singular: "faq", plural: "faqs" },
        underscored: true,
        scopes: {
          localization({ lang, exclude = [] }) {
            return {
              attributes: {
                exclude: ["enQuestion", "arQuestion", "enAnswer", "arAnswer", ...exclude],
                include: [
                  [`${lang}_Question`, "question"],
                  [`${lang}_Answer`, "answer"],
                ],
              },
            };
          },
        },
      }
    );
  }
  static associate() {}
}

module.exports = Faq;
