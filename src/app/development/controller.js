const { httpCodes } = require("../../utils");
const LogQueryService = require("./service");

module.exports = {
  getLogs: async (req, res) => {
    console.log("test");
    const filters = req.query;
    const result = await LogQueryService.getLogs(filters);
    if (req.query.text) res.status(httpCodes.OK).send(result);
    else res.status(httpCodes.OK).json({ data: result });
  },
};
