const Employee = require("./service");
const { httpCodes, getPagination } = require("../../utils");

module.exports = {
  create: async (req, res) => {
    const { user, body, file } = req;
    const result = await new Employee(body).create(user, file);
    res.status(httpCodes.CREATED).send(result);
  },

  update: async (req, res) => {
    const { user, body, file, params } = req;
    const result = await new Employee(body).update(user, params.id, file);
    res.status(httpCodes.UPDATED).send(result);
  },

  delete: async (req, res) => {
    const { user, params } = req;
    await Employee.delete(user, params.id);
    res.sendStatus(httpCodes.DELETED);
  },

  getById: async (req, res) => {
    const { user, language, params } = req;
    const result = await Employee.getById(user, params.id, language);
    res.status(httpCodes.OK).send(result);
  },

  getAll: async (req, res) => {
    const { user, language } = req;
    const { pagination, query } = getPagination(req.query);
    const result = await Employee.getAll(user, query, pagination, language);
    res.status(httpCodes.OK).send(result);
  },

};
