const Joi = require("joi");
const { commonValidators } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  paramId: commonValidators.paramId,

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      id: commonValidators.idArray,
      invite: Joi.bool(),
    }),
  }),
};
