const { httpCodes, getPagination } = require("../../utils");
const Restaurant = require("./service");

module.exports = {
  getAll: async (req, res) => {
    const { language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Restaurant.getAll(query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },

  getById: async (req, res) => {
    const { params, language } = req;
    const result = await Restaurant.getById(params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  signup: async (req, res) => {
    const { body, file } = req;
    const result = await new Restaurant(body).signup(file);
    res.status(httpCodes.CREATED).send(result);
  },

  update: async (req, res) => {
    const { user, body, file } = req;
    const result = await new Restaurant(body).update(user, file);
    res.status(httpCodes.UPDATED).send(result);
  },
};
