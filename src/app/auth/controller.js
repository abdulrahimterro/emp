const service = require("./service");
const { httpCodes } = require("../../utils");

module.exports = {
  login: async (req, res) => {
    const { body: data, language } = req;
    const result = await service.login(data, language);
    res.status(httpCodes.OK).send(result);
  },

  refreshToken: async (req, res) => {
    const { body: data, language } = req;
    const result = await service.refreshToken(data, language);
    res.status(httpCodes.OK).send(result);
  },

  signup: async (req, res) => {
    const { body } = req;
    const result = await service.signup(body);
    res.status(httpCodes.CREATED).send(result);
  },

  forgetPassword: async (req, res) => {
    const { body } = req;
    await service.forgetPassword(body);
    res.sendStatus(httpCodes.OK);
  },

  resetPassword: async (req, res) => {
    const { body } = req;
    await service.resetPassword(body);
    res.sendStatus(httpCodes.OK);
  },

  verify: async (req, res) => {
    const { body } = req;
    await service.verify(body);
    res.sendStatus(httpCodes.OK);
  },

  authorization: async (req, res, next) => {
    // get the authorization header from request
    const authorizationHeader = req.headers["Authorization"] || req.headers["authorization"];
    const token = authorizationHeader?.split(" ")[1];
    const result = await service.authorization(token).catch((err) => next(err));
    if (result) {
      req.user = result;
      next();
    }
  },
};
