const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class ForgetPassword extends BaseModel {
  static initialize() {
    ForgetPassword.init(
      {
        token: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        usedAt: { type: DataTypes.DATE },
        expireAt: { type: DataTypes.DATE, allowNull: false },
      },
      {
        sequelize,
        timestamps: false,
        underscored: true,
      }
    );
  }

  static associate() {
    const { User } = sequelize.models;
    this.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });
  }
}

module.exports = ForgetPassword;
