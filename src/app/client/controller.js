const Client = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  getById: async (req, res) => {
    const { user, language, params } = req;
    const result = await Client.getById(user, params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { user, language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Client.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
