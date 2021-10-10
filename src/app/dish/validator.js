const Joi = require("joi");
const { commonValidators, statusCodes } = require("../../utils");
const db = require("../../database").models;

module.exports = {
  paramId: commonValidators.paramId,

  create: Joi.object({
    body: Joi.object({
      categoryId: Joi.number().required(),
      enName: Joi.string().required(),
      arName: Joi.string().required(),
      enDescription: Joi.string().required(),
      arDescription: Joi.string().required(),
      code: Joi.string().required(),
      price: Joi.number().min(0).required(),
      calories: Joi.number(),
      preparationTime: Joi.number().required(),
      allergies: Joi.array().items(Joi.number().integer().min(0)),
    }).required(),
  }),

  update: Joi.object({
    params: Joi.object({
      id: Joi.number().min(0).required(),
    }).required(),
    body: Joi.object({
      enName: Joi.string(),
      arName: Joi.string(),
      enDescription: Joi.string(),
      arDescription: Joi.string(),
      code: Joi.string(),
      price: Joi.number().min(0),
      discount: Joi.number().min(0).max(1),
      status: Joi.string().valid(..._.values(db.Dish.STATUS)),
      allergies: Joi.array().items(Joi.number().integer().min(0)),
      calories: Joi.number(),
      preparationTime: Joi.number(),
    }).required(),
  }),

  getAll: Joi.object({
    query: Joi.object({
      ...commonValidators.pagination,
      ...commonValidators.order(["id", "name", "price", "discount"]),
      categoryId: Joi.number().integer().min(1).required(),
      restaurantId: Joi.number().integer().min(1),
      name: Joi.string(),
      status: Joi.alternatives().try(
        Joi.array().items(Joi.string().valid(..._.values(db.Dish.STATUS))),
        Joi.string().valid(..._.values(db.Dish.STATUS))
      ),
    }),
  }),

  changeStatus: Joi.object({
    params: Joi.object({
      id: Joi.number().required(),
    }).required(),
    body: Joi.object({
      status: Joi.string()
        .valid(..._.values(db.Dish.STATUS))
        .required(),
    }).required(),
  }),
};
