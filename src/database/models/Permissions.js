const { DataTypes } = require("sequelize");
const { BaseModel, enums } = require("./embedded");
const sequelize = require("../sequelize");

class Permission extends BaseModel {
  static EN_NAME = enums.permission.enName;
  static AR_NAME = enums.permission.arName;

  static initialize() {
    Permission.init(
      {
        enRole: { type: DataTypes.ENUM(_.values(Permission.EN_NAME)), allowNull: false },
        arRole: { type: DataTypes.ENUM(_.values(Permission.AR_NAME)), allowNull: false },
        icon: { type: DataTypes.TEXT, allowNull: false },
      },
      {
        sequelize,
        name: { singular: "permission", plural: "permissions" },
        timestamps: false,
        underscored: true,
        scopes: {
          localization({ lang, exclude = [] }) {
            return {
              attributes: {
                exclude: ["enRole", "arRole", ...exclude],
                include: [[`${lang}_role`, "role"]],
              },
            };
          },
        },
      }
    );
  }

  static associate() {
    const { User } = sequelize.models;
    this.belongsToMany(User, { through: "user_permission", timestamps: false });
  }
}

module.exports = Permission;
