const Order = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  create: async (req, res) => {
    console.time("handler");
    const { body, language } = req;
    const result = await Order.create(body, language);
    res.status(httpCodes.CREATED).send(result);
    console.timeEnd("handler");
    console.timeEnd("overAll");
  },

  update: async (req, res) => {
    const { body, params, user } = req;
    const result = await new Order(body).update(user, params.id);
    res.status(httpCodes.UPDATED).send(result);
  },

  getById: async (req, res) => {
    const { params, user, language } = req;
    const result = await Order.getById(user, params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { user, language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Order.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },

  getStatusCount: async (req, res) => {
    const { user, query } = req;
    const result = await Order.getStatusCount(user, query);
    res.status(httpCodes.OK).send(result);
  },
};
