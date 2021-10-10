const { jwt, emailsTemplate } = require("../../../configs");
const { JWTGenerator, mailSender, moment, errors, Exception } = require("../../utils");
const { compare } = require("bcrypt");
const { verify } = require("jsonwebtoken");
const sequelize = require("../../database");
const { Op } = require("sequelize");
const User = require("../user/service");
const db = sequelize.models;

module.exports = {
  login: async ({ email, password }, lang) => {
    const user = await db.User.logIn({ email }, lang);
    // verify password
    if (!(await compare(password, user.password))) throw new Exception(errors.Invalid_Password);

    // generate JWT tokens
    const result = JWTGenerator(user);
    result.user = _.omit(user, ["password"]);

    return { data: result };
  },

  signup: async (data) => {
    const invite = await db.Invite.findOne({ where: { token: data.token } });
    if (!invite) throw new Exception(errors.InviteToken_Not_Found);

    await sequelize.transaction(async (transaction) => {
      await Promise.all([
        new User({
          ...data,
          email: invite.to,
          status: db.User.STATUS.active,
          restaurantId: invite.restaurantId,
          permissions: invite.permissionId,
          menus: invite.menuId,
          verified: true,
        }).create(true),
        invite.destroy(),
      ]);
    });
  },

  refreshToken: async (body, lang) => {
    const { id } = verify(body.refreshToken, jwt.refresh.key);

    const user = await db.User.logIn({ id }, lang);
    if (!user) throw new Exception(errors.Unauthorized);

    // generate JWT tokens
    const result = JWTGenerator(user);
    result.user = _.omit(user, ["password"]);

    return { data: result };
  },

  forgetPassword: async (body) => {
    const user = await db.User.findOne({ attributes: ["id", "firstName"], where: { email: body.email } });
    if (!user) throw new Exception(errors.Email_Not_Found);

    await sequelize.transaction(async (transaction) => {
      const [forgetPassword, created] = await db.ForgetPassword.findOrCreate({
        where: { userId: user.id, usedAt: { [Op.is]: null } },
        defaults: { userId: user.id, usedAt: null, expireAt: moment(new Date()).add(48, "hours") },
      });
      if (!created) {
        forgetPassword.expireAt = moment(new Date()).add(48, "hours");
        forgetPassword.token = require("uuid").v4();
        await forgetPassword.save();
      }

      await mailSender(body.email, "Reset Password", emailsTemplate.forgotPassword, {
        userName: user.firstName,
        url: `/reset-password?token=${forgetPassword.token}`,
      });
    });
  },

  resetPassword: async (body) => {
    const forgetPassword = await db.ForgetPassword.findOne({
      where: { token: body.token, expireAt: { [Op.gt]: new Date() }, usedAt: { [Op.is]: null } },
    });
    if (!forgetPassword) throw new Exception(errors.ResetPassword_Token_Not_found);

    await sequelize.transaction(async (transaction) => {
      forgetPassword.usedAt = new Date();
      await Promise.all([
        db.User.update({ password: body.password }, { where: { id: forgetPassword.userId }, individualHooks: true }),
        forgetPassword.save(),
      ]);
    });
  },

  verify: async (body) => {
    const user = await db.User.findOne({ where: { verifyCode: body.code } });
    if (!user) throw new Exception(errors.Email_VerifyCode_Not_found);

    user.verified = true;
    await user.save();
  },

  authorization: async (token) => {
    const payload = verify(token, jwt.access.key);

    //TODO: handle other Unauthorized conditions .. like fired user
    let user = await db.User.findByPk(payload.id, {
      attributes: ["id", "firstName", "email", "password", "verified", "isSuper", "restaurantId"],
      include: [
        { attributes: ["id"], model: db.Permission, through: { attributes: [] } },
        { attributes: ["id"], model: db.Menu, through: { attributes: [] } },
      ],
    });
    if (!user) throw new Exception(errors.Unauthorized);

    user = user.get({ plain: true });
    user.menus = user.menus.map((val) => val.id);
    user.permissions = user.permissions.map((val) => val.id);

    return user;
  },
};
