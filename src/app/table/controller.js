const Table = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  getByCode: async (req, res) => {
    const { language } = req;
    const { code } = req.params;
    const result = await Table.getByCode(code, language);
    res.status(httpCodes.OK).send(result);
  },

  getOrders: async (req, res) => {
    const { language } = req;
    const { id } = req.params;
    const result = await Table.getOrders(id, language);
    res.status(httpCodes.OK).send(result);
  },

  update: async (req, res) => {
    const { user, body, params } = req;
    await new Table(body).update(user, params.id);
    res.sendStatus(httpCodes.UPDATED);
  },

  getAll: async (req, res) => {
    const { language, user } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Table.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
