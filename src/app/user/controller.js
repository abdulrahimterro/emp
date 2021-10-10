const User = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  invite: async (req, res) => {
    const { user, body, language } = req;
    const result = await User.invite(user, body, language);
    res.status(httpCodes.OK).send(result);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { user, body } = req;
    const result = await new User(body).update(user, id);
    res.status(httpCodes.UPDATED).send(result);
  },

  getAll: async (req, res) => {
    const { user, language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await User.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },

  getById: async (req, res) => {
    const { user, language } = req;
    const { id } = req.params;
    const result = await User.getById(user, id, language);
    res.status(httpCodes.OK).send(result);
  },

  getProfile: async (req, res) => {
    const { user, language } = req;
    const result = await User.getProfile(user, language);
    res.status(httpCodes.OK).send(result);
  },

  updateProfile: async (req, res) => {
    const { user, body, file } = req;
    const result = await new User(body).updateProfile(user, file);
    res.status(httpCodes.UPDATED).send(result);
  },

  changePassword: async (req, res) => {
    const { user, body } = req;
    await User.changePassword(user, body);
    res.sendStatus(httpCodes.UPDATED);
  },

  resendVerification: async (req, res) => {
    const { user } = req;
    await User.resendVerification(user);
    res.sendStatus(httpCodes.OK);
  },
};
