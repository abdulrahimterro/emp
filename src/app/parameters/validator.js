const Joi = require("joi");
const { commonValidators } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  partners: Joi.object({
    body: Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      note: Joi.string().required(),
    }),
  }),
};
