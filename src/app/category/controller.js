const Category = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  //MM-7
  create: async (req, res) => {
    const { user, body } = req;
    const result = await new Category(body).create(user);
    res.status(httpCodes.CREATED).send(result);
  },

  //MM-7
  update: async (req, res) => {
    const { user, body, params } = req;
    const result = await new Category(body).update(user, params.id);
    res.status(httpCodes.UPDATED).send(result);
  },

  //MM-7
  delete: async (req, res) => {
    const { user, params } = req;
    await Category.delete(user, params.id);
    res.sendStatus(httpCodes.DELETED);
  },

  //MM-7
  getById: async (req, res) => {
    const { params, language, user } = req;
    const result = await Category.getById(user, params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  //MM-7
  getAll: async (req, res) => {
    const { language, user } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Category.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
