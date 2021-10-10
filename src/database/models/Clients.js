const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class Client extends BaseModel {
  static initialize() {
    Client.init(
      {
        orderNumber: { type: DataTypes.SMALLINT, defaultValue: 1 },
        checkout: { type: DataTypes.DATE },
      },
      {
        sequelize,
        name: { singular: "client", plural: "clients" },
        underscored: true,
      }
    );
  }

  static associate() {
    const { Table, User, Order } = sequelize.models;
    this.belongsTo(Table, { foreignKey: { name: "tableId", allowNull: false } });
    this.belongsTo(User, { foreignKey: { name: "userId", allowNull: true } });

    this.hasMany(Order, { foreignKey: { name: "clientId", allowNull: false } });
  }
}

module.exports = Client;
