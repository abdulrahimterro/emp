const { domain, bcrypt } = require("../../../configs");
const { errors, Exception } = require("../../utils");
const { hash } = require("bcrypt");
const { DataTypes } = require("sequelize");
const { BaseModel, enums } = require("./embedded");
const sequelize = require("../sequelize");

class User extends BaseModel {
  static STATUS = enums.user.status;
  static TYPE = enums.user.types;

  static initialize() {
    User.init(
      {
        firstName: { type: DataTypes.STRING(40), allowNull: false },
        lastName: { type: DataTypes.STRING(40), allowNull: false },
        email: { type: DataTypes.STRING, unique: "user_email", allowNull: false },
        password: { type: DataTypes.TEXT, allowNull: false },
        phone: { type: DataTypes.STRING(20) },
        birthDate: { type: DataTypes.DATE },
        avatar: {
          type: DataTypes.TEXT,
          set(value) {
            value ? this.setDataValue("avatar", domain + "/" + value) : this.setDataValue("avatar", null);
          },
        },
        address: { type: DataTypes.TEXT },
        type: { type: DataTypes.ENUM(_.values(User.TYPE)), defaultValue: User.TYPE.employee },
        status: { type: DataTypes.ENUM(_.values(User.STATUS)), defaultValue: User.STATUS.pending },
        verified: { type: DataTypes.BOOLEAN, defaultValue: false },
        verifyCode: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
        isSuper: { type: DataTypes.BOOLEAN, defaultValue: false },
      },
      {
        sequelize,
        name: { singular: "user", plural: "users" },
        underscored: true,
        defaultScope: {
          attributes: { exclude: ["password", "verifyCode"] },
        },
        hooks: {
          beforeCreate: async (instance, option) => {
            instance.password = await hash(instance.password, bcrypt.rounds);
          },
          beforeUpdate: async (instance, option) => {
            if (instance.password) instance.password = await hash(instance.password, bcrypt.rounds);
          },
        },
      }
    );
  }

  static associate() {
    const { Restaurant, Menu, Permission, Client, Order, ForgetPassword } = sequelize.models;
    this.belongsTo(Restaurant, {
      foreignKey: { name: "restaurantId", allowNull: true },
      onDelete: "CASCADE",
    });
    this.belongsToMany(Permission, { through: "user_permission", timestamps: false });
    this.belongsToMany(Menu, { through: "user_menu", timestamps: false });

    this.hasMany(Client, { foreignKey: { name: "userId", allowNull: true } });
    this.hasMany(Order, { foreignKey: { name: "userId", allowNull: true } });
    this.hasMany(ForgetPassword, { foreignKey: { name: "userId", allowNull: false } });
  }

  static async logIn(condition, lang) {
    const exclude = ["phone", "birthDate", "address", "verifyCode", "restaurantId", "createdAt", "updatedAt", "deletedAt"];
    const scope = { method: ["localization", { lang, exclude }] };
    const db = sequelize.models;
    let user = await this.unscoped().findOne({
      attributes: { exclude },
      where: condition,
      include: [
        {
          model: db.Restaurant.scope(scope),
          include: {
            attributes: ["expireAt"],
            where: { status: db.RestaurantsSubscription.STATUS.active },
            model: db.RestaurantsSubscription,
            limit: 1,
            order: [["id", "desc"]],
          },
        },
        { model: db.Permission, through: { attributes: [] } },
        { model: db.Menu, attributes: ["id"], through: { attributes: [] } },
      ],
    });
    if (!user) throw new Exception(errors.Email_Not_Found);

    user = user.get({ plain: true });
    if (!user.restaurant) return _.omit(user, ["menus", "permissions"]);

    user.restaurant.subscriptionExpireAt = user.restaurant?.subscriptions[0].expireAt;
    delete user.restaurant.subscriptions;

    user.menus = user.menus.map((val) => val.id);
    user.permissions = user.permissions.map((val) => val.id);

    return user;
  }
}

module.exports = User;
