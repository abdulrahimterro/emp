const service = require("./service");
const { httpCodes, getPagination } = require("../../../utils");

module.exports = {
  create: async (req, res) => {
    const { body } = req;
    const result = await service.create(body);
    res.status(httpCodes.CREATED).send(result);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const result = await service.update(body, id);
    res.status(httpCodes.UPDATED).send(result);
  },

  delete: async (req, res) => {
    const { id } = req.params;
    await service.delete(id);
    res.sendStatus(httpCodes.DELETED);
  },

  getById: async (req, res) => {
    const { params, language, user } = req;
    const result = await service.getById(user, params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { language, user } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await service.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },
};
