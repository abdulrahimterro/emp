const Dish = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  create: async (req, res) => {
    const { user, body, files } = req;
    const result = await new Dish(body).create(user, files);
    res.status(httpCodes.CREATED).send(result);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { user, body, files } = req;
    const result = await new Dish(body).update(user, id, files);
    res.status(httpCodes.UPDATED).send(result);
  },

  delete: async (req, res) => {
    const { user, params } = req;
    await Dish.delete(user, params.id);
    res.sendStatus(httpCodes.DELETED);
  },

  getById: async (req, res) => {
    const { params, language, user } = req;
    const result = await Dish.getById(user, params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { language, user } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Dish.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
