const CategoryIcon = require("./service");
const { httpCodes, getPagination } = require("../../../utils");

module.exports = {
  getAll: async (req, res) => {
    const { pagination, query } = getPagination(req.query);
    const { language } = req;
    const result = await CategoryIcon.getAll(query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },

  getById: async (req, res) => {
    const { id } = req.params;
    const { language } = req;
    const result = await CategoryIcon.getById(id, language);
    res.status(httpCodes.OK).send(result);
  },
};
