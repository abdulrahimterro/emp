const Menu = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  create: async (req, res) => {
    const { user, body, file } = req;
    const result = await new Menu(body).create(user, file);
    res.status(httpCodes.CREATED).send(result);
  },

  update: async (req, res) => {
    const { user, body, file, params } = req;
    const result = await new Menu(body).update(user, params.id, file);
    res.status(httpCodes.UPDATED).send(result);
  },

  delete: async (req, res) => {
    const { user, params } = req;
    await Menu.delete(user, params.id);
    res.sendStatus(httpCodes.DELETED);
  },

  getById: async (req, res) => {
    const { user, language, params } = req;
    const result = await Menu.getById(user, params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { user, language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Menu.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },

  getTables: async (req, res) => {
    const { user, params } = req;
    const result = await Menu.getTables(user, params.id);
    res.status(httpCodes.OK).send(result);
  },
};
