const { DataTypes } = require("sequelize");
const { BaseModel, enums } = require("./embedded");
const sequelize = require("../sequelize");

class Order extends BaseModel {
  static STATUS = enums.order.status;

  static initialize() {
    Order.init(
      {
        amount: { type: DataTypes.INTEGER, defaultValue: 1 },
        note: { type: DataTypes.TEXT, defaultValue: "" },
        status: { type: DataTypes.ENUM(..._.values(Order.STATUS)), defaultValue: Order.STATUS.pending },
        price: { type: DataTypes.FLOAT, allowNull: false },
      },
      {
        sequelize,
        underscored: true,
        name: { singular: "order", plural: "orders" },
        defaultScope: {
          attributes: { exclude: ["deletedAt"] },
        },
      }
    );
  }

  static associate() {
    const { Client, Dish, User } = sequelize.models;
    this.belongsTo(Client, { foreignKey: { name: "clientId", allowNull: false } });
    this.belongsTo(Dish, { foreignKey: { name: "dishId", allowNull: false } });
    this.belongsTo(User, { foreignKey: { name: "userId" } });
  }
}

module.exports = Order;
