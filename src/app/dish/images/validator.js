const Joi = require("joi");
const { commonValidators } = require("../../../utils");

module.exports = {
  paramIdImageId: Joi.object({
    params: Joi.object({
      id: Joi.number().required(),
      imageId: Joi.number().required(),
    }).required(),
  }),
};
