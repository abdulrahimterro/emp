const { httpCodes, getPagination } = require("../../utils");
const Subscription = require("./service");

module.exports = {
  create: async (req, res) => {
    const { body } = req;
    const result = await new Subscription(body).create(body);
    res.status(httpCodes.CREATED).send(result);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const result = await new Subscription(body).update(id);
    res.status(httpCodes.UPDATED).send(result);
  },

  delete: async (req, res) => {
    const { id } = req.params;
    await Subscription.delete(id);
    res.sendStatus(httpCodes.DELETED);
  },

  getById: async (req, res) => {
    const { language } = req;
    const { id } = req.params;
    const result = await Subscription.getById(id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Subscription.getAll(query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
