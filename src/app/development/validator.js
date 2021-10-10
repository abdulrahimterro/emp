const Joi = require("joi");

module.exports = {
  logs: Joi.object({
    query: Joi.object({
      limit: Joi.number().integer().min(1).required(),
      fromDate: Joi.date().required(),
      toDate: Joi.date().required(),
      minTimeElapsed: Joi.number().integer(),
      maxTimeElapsed: Joi.number().integer(),
      minResponseTime: Joi.number().integer(),
      maxResponseTime: Joi.number().integer(),
      statusCode: Joi.number().integer(),
      userId: Joi.number().integer(),
      level: Joi.string().valid("success", "error", "warning"),
      method: Joi.string().valid("GET", "POST", "PUT", "PATCH", "DELETE"),
      remoteAddress: Joi.string(),
      url: Joi.string(),
      excludeUrl: Joi.string(),
      textSearch: Joi.string().min(3),
      text: Joi.boolean(),
      noResponse: Joi.boolean(),
      noParams: Joi.boolean(),
    }),
  }),
};
