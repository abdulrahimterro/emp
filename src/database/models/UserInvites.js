const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class Invite extends BaseModel {
  static initialize() {
    Invite.init(
      {
        token: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        to: { type: DataTypes.STRING, allowNull: false },
      },
      {
        sequelize,
        name: { singular: "invite", plural: "invites" },
        updatedAt: false,
        underscored: true,
      }
    );
  }

  static associate() {
    const { Restaurant, Permission, Menu } = sequelize.models;
    this.belongsTo(Restaurant, { foreignKey: { name: "restaurantId", allowNull: false } });
    this.belongsTo(Permission, { foreignKey: { name: "permissionId", allowNull: false } });
    this.belongsTo(Menu, { foreignKey: { name: "menuId", allowNull: false } });
  }
}

module.exports = Invite;
