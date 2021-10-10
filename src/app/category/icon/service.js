const sequelize = require("../../../database");
const { errors, Exception } = require("../../../utils");
const db = sequelize.models;

class CategoryIcon {
  constructor(data) {
    this.name = data.name;
    this.url = data.url;
  }

  static async getAll(filters, { offset, limit, total }, lang) {
    const query = { offset, limit };
    const result = await db.CategoryIcon.scope({ method: ["localization", { lang }] }).customFind(query, total);
    return result;
  }

  static async getById(id, lang) {
    const result = await db.CategoryIcon.scope({ method: ["localization", { lang }] }).findByPk(id);
    if (!result) throw new Exception(errors.CategoryIcon_Not_Found);
    return { data: result };
  }
}

module.exports = CategoryIcon;
