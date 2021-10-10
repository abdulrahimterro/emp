const { emailsTemplate, assetsPath } = require("../../../configs");
const { mailSender, errors, Exception, fileUtil } = require("../../utils");
const sequelize = require("../../database");
const { Op } = require("sequelize");
const { compare } = require("bcrypt");

const db = sequelize.models;

class User {
  constructor(data) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.oldPassword = data.password?.old;
    this.password = data.password?.new || data.password;
    this.email = data.email;
    this.phone = data.phone;
    this.birthDate = data.birthDate;
    this.address = data.address;
    this.status = data.status;
    this.verified = data.verified;
    this.isSuper = data.isSuper;
    this.permissions = data.permissions;
    this.menus = data.menus;
    this.restaurantId = data.restaurantId;
    this.avatar = data.avatar ? null : undefined;
  }

  async create(fromInvite) {
    const user = await db.User.create(this);
    await Promise.all([user.setPermissions(this.permissions), user.setMenus(this.menus || [])]);
    if (!fromInvite) {
      await mailSender(this.email, "Verify Email", emailsTemplate.emailVerification, {
        userName: user.firstName,
        url: `/verify?code=${user.verifyCode}`,
      });
    }
  }

  static async invite(user, data, lang) {
    data.restaurantId = user.restaurantId;
    await sequelize.transaction(async (transaction) => {
      const scope = { method: ["localization", { lang }] };
      let [restaurant, permission, email] = await Promise.all([
        db.Restaurant.scope(scope).findOne({ where: { id: user.restaurantId } }),
        db.Permission.scope(scope).findByPk(data.permissionId),
        db.User.findOne({ where: { email: data.to } }),
      ]);
      if (!restaurant) throw new Exception(errors.Restaurant_Not_Found);
      if (!permission) throw new Exception(errors.Permission_Not_Found);
      if (email) throw new Exception(errors.Database_Conflict);

      restaurant = restaurant.get({ plain: true });
      permission = permission.get({ plain: true });

      if (!user.menus.includes(Number(data.menuId))) throw new Exception(errors.Menu_Not_Found);
      if (Math.min(user.permissions) >= data.permissionId && !user.isSuper)
        throw new Exception(errors.Invalid_Permission_Grant);

      const [invite, created] = await db.Invite.findOrCreate({ where: { to: data.to }, defaults: data });
      if (!created) await invite.update(data);
      const subject = `Work invitation in "${restaurant.name}"`;
      await mailSender(data.to, subject, emailsTemplate.userInvite, {
        restaurantName: restaurant.name,
        role: permission.role,
        url: `/invite?token=${invite.token}`,
      });
    });
  }

  async update(user, id) {
    if (user.id == id) throw new Exception(errors.User_Self_Update);

    await sequelize.transaction(async (transaction) => {
      let foundUser = await db.User.findOne({
        where: { id, restaurantId: user.restaurantId },
        include: [
          { attributes: ["id"], model: db.Permission, through: { attributes: [] } },
          { attributes: ["id"], model: db.Menu, through: { attributes: [] } },
        ],
      });
      if (!foundUser) throw new Exception(errors.User_Not_Found);

      if (this.permissions && updatePermissionsCheck(user, foundUser, this.permissions))
        await foundUser.setPermissions(this.permissions);
      if (this.menus && updateMenusCheck(user, foundUser, this.menus)) await foundUser.setMenus(this.menus);

      await foundUser.update(this);
    });
  }

  static async getAll(user, filters, { offset, limit, total }, lang) {
    const conditions = (() => {
      const result = { restaurantId: user.restaurantId };

      if (filters.firstName) result["firstName"] = { [Op.like]: `${filters.firstName}%` };
      if (filters.lastName) result["lastName"] = { [Op.like]: `${filters.lastName}%` };
      if (filters.status) result["status"] = filters.status;

      return result;
    })();
    const permissionConditions = filters.permissionId ? { id: filters.permissionId } : {};
    const scope = {
      method: [
        "localization",
        { lang, exclude: ["currency", "image", "createdAt", "updatedAt", "deletedAt", "restaurantId", "location"] },
      ],
    };

    const query = {
      attributes: { exclude: ["restaurantId", "address", "birthDate"] },
      where: conditions,
      include: [
        { model: db.Permission.scope(scope), through: { attributes: [] }, where: permissionConditions },
        { model: db.Menu.scope(scope), through: { attributes: [] } },
      ],
      offset,
      limit,
      order: [["id", "desc"]],
      distinct: true,
    };

    const result = await db.User.customFind(query, total);

    return result;
  }

  static async getById(user, id, lang) {
    const scope = {
      method: ["localization", { lang, exclude: ["currency", "image", "createdAt", "updatedAt", "deletedAt", "restaurantId"] }],
    };
    const result = await db.User.findOne({
      attributes: { exclude: ["restaurantId"] },
      where: { id, restaurantId: user.restaurantId },
      include: [
        { model: db.Permission.scope(scope), through: { attributes: [] } },
        { model: db.Menu.scope(scope), through: { attributes: [] } },
      ],
    });
    if (!result) throw new Exception(errors.User_Not_Found);

    return { data: result };
  }

  static async getProfile(user, lang) {
    const scope = { method: ["localization", { lang }] };
    const result = await db.User.findByPk(user.id, {
      include: [{ model: db.Permission.scope(scope), through: { attributes: [] } }],
    });
    if (!result) throw new Exception(errors.User_Not_Found);

    return { data: result };
  }

  async updateProfile(user, file) {
    await sequelize.transaction(async (transaction) => {
      if (file) this.avatar = fileUtil.uri(assetsPath.user.avatar, file);

      if (this.email) {
        this.verified = false;
        this.verifyCode = require("uuid").v4();
      }
      if (this.oldPassword) {
        const auth = await compare(this.oldPassword, user.password);
        if (!auth) throw new Exception(errors.Invalid_Password);
      }

      const [result] = await Promise.all([
        db.User.findOne({ where: { id: user.id } }),
        db.User.update(this, { where: { id: user.id }, individualHooks: true }),
      ]);

      if ((this.avatar || this.avatar === null) && result.avatar) await fileUtil.delete(result.avatar);
      if (file) await fileUtil.save(this.avatar, file.buffer);
      if (this.email) {
        await mailSender(this.email, "Verify Email", emailsTemplate.emailVerification, {
          userName: user.firstName,
          url: `/verify?code=${this.verifyCode}`,
        });
      }
    });
  }

  static async resendVerification(user) {
    await sequelize.transaction(async (transaction) => {
      if (user.verified) throw new Exception(errors.User_Email_Verified);
      const verifyCode = require("uuid").v4();
      await db.User.update({ verifyCode }, { where: { id: user.id } });
      await mailSender(result.email, "Verify Email", emailsTemplate.emailVerification, {
        userName: result.firstName,
        url: `/verify?code=${result.verifyCode}`,
      });
    });
  }
}

function updatePermissionsCheck(user, foundUser, permissions) {
  if (user.isSuper) return true;

  const userPermission = foundUser.permissions.map((val) => val.id);
  const grant = permissions.filter((val) => !userPermission.includes(val));
  const revoke = userPermission.filter((val) => !permissions.includes(val));
  const maxPermission = Math.min(user.permissions);

  if (!grant.every((val) => val > maxPermission)) throw new Exception(errors.Invalid_Permission_Grant);
  if (!revoke.every((val) => val > maxPermission)) throw new Exception(errors.Invalid_Permission_Grant);

  return true;
}

function updateMenusCheck(user, foundUser, menus) {
  const userMenus = foundUser.menus.map((val) => val.id);
  const grant = menus.filter((val) => !userMenus.includes(val));
  const revoke = userMenus.filter((val) => !menus.includes(val));

  if (!grant.every((val) => user.menus.includes(val))) throw new Exception(errors.Menu_Grant_Permission);
  if (!revoke.every((val) => user.menus.includes(val))) throw new Exception(errors.Menu_Grant_Permission);

  // revoke menu permission from owner
  const isOwner = foundUser.permissions.map((val) => val.id).includes(1);
  if (isOwner && !user.isSuper && revoke.length) throw new Exception(errors.Menu_Grant_Permission);

  return true;
}

module.exports = User;