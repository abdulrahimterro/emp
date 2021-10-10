const sequelize = require("../../database");
const { errors, Exception } = require("../../utils");
const { Op } = require("sequelize");

const db = sequelize.models;

class Allergy {
  constructor(data) {
    this.name = data.name;
    this.arName = data.arName;
  }

  static async getById(id, lang) {
    const result = await db.Allergy.scope({ method: ["localization", { lang }] }).findByPk(id);
    if (!result) throw new Exception(errors.Dish_Not_Found);
    return { data: result };
  }

  static async getAll({ name }, { offset, limit, total }, lang) {
    const conditions = {};
    if (name) conditions[`${lang}Name`] = { [Op.like]: `${name}%` };
    const exclude = [];
    const order = lang === "en" ? "enName" : "arName";

    const query = {
      attributes: { exclude },
      where: conditions,
      order: [[order, "asc"]],
    };

    const result = await db.Allergy.scope({ method: ["localization", { lang, exclude }] }).customFind(query, total);
    return result;
  }
}

module.exports = Allergy;
