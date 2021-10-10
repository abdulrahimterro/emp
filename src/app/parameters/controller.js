const Parameters = require("./service");
const { httpCodes } = require("../../utils");

module.exports = {
  getEnums: async (req, res) => {
    const result = await Parameters.getEnums();
    res.status(httpCodes.OK).send(result);
  },

  getErrors: async (req, res) => {
    const { code } = req.query;
    const result = await Parameters.getErrors(code);
    res.status(httpCodes.OK).send(result);
  },

  partners: async (req, res) => {
    const { body } = req;
    const result = await Parameters.partners(body);
    res.status(httpCodes.OK).send(result);
  },
};
