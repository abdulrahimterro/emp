const RestaurantsSubscription = require("./service");
const { httpCodes, getPagination } = require("../../../utils");

module.exports = {
  getById: async (req, res) => {
    const { user, language } = req;
    const { id } = req.params;
    const result = await RestaurantsSubscription.getById(user, id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { user, language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await RestaurantsSubscription.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
