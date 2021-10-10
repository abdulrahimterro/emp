const { DataTypes } = require("sequelize");
const { BaseModel, enums } = require("./embedded");
const sequelize = require("../sequelize");

class Table extends BaseModel {
  static STATUS = enums.table.status;
  static TYPE = enums.table.types;

  static initialize() {
    Table.init(
      {
        type: { type: DataTypes.ENUM(_.values(Table.TYPE)), defaultValue: Table.TYPE.inside },
        code: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        number: { type: DataTypes.SMALLINT, allowNull: false },
        status: { type: DataTypes.ENUM(_.values(Table.STATUS)), defaultValue: Table.STATUS.active },
      },
      {
        indexes: [{ unique: true, fields: ["restaurant_id", "code"] }],
        sequelize,
        name: { singular: "table", plural: "tables" },
        timestamps: false,
        paranoid: true,
        underscored: true,
      }
    );
  }

  static associate() {
    const { Client, Restaurant, Menu } = sequelize.models;
    this.hasMany(Client, { foreignKey: { name: "tableId", allowNull: false } });
    this.belongsTo(Restaurant, { foreignKey: { name: "restaurantId", allowNull: false } });
    this.belongsTo(Menu, { foreignKey: { name: "menuId", allowNull: false } });
  }
}

module.exports = Table;
