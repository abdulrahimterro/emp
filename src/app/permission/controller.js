const Permission = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  getAll: async (req, res) => {
    const { user, language } = req;
    const { query, pagination } = getPagination(req.query);
    const result = await Permission.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
