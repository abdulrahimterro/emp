const sequelize = require("../../../database");
const { errors, Exception } = require("../../../utils");
const db = sequelize.models;

module.exports = {
  create: async (body) => {
    const faq = await db.Faq.create(body);
    return { data: { id: faq.id } };
  },

  delete: async (id) => {
    const rows = await db.Faq.destroy({ where: { id } });
    if (!rows) throw new Exception(errors.Faq_Not_Found);
  },

  getById: async (user, id, lang) => {
    const scope = user ? {} : { method: ["localization", { lang }] };
    const result = await db.Faq.scope(scope).findByPk(id);
    if (!result) throw new Exception(errors.Faq_Not_Found);
    return { data: result };
  },

  getAll: async (user, filters, { offset, limit, total }, lang) => {
    const scope = user ? {} : { method: ["localization", { lang }] };
    const result = await db.Faq.scope(scope).customFind({}, total);
    return result;
  },
};
