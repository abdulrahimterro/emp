const Allergy = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  getById: async (req, res) => {
    const { params, language } = req;
    const result = await Allergy.getById(params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Allergy.getAll(query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
