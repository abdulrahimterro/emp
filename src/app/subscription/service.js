const sequelize = require("../../database");
const { Exception, errors } = require("../../utils");

const db = sequelize.models;

class Subscription {
  constructor(data) {
    this.enName = data.enName;
    this.arName = data.arName;
    this.duration = data.duration;
    this.durationUnit = data.durationUnit;
    this.price = data.price;
    this.discount = data.discount;
    this.enDescription = data.enDescription;
    this.arDescription = data.arDescription;
  }

  async create() {
    const subscription = await db.Subscription.create(this);
    return { data: { id: subscription.id } };
  }

  async update(id) {
    await db.Subscription.update(this, { where: { id } });
  }

  static async delete(id) {
    const rows = await db.Subscription.destroy({ where: { id } });
    if (!rows) throw new Exception(errors.Subscription_Not_Found);
  }

  static async getById(id, lang) {
    const exclude = [];
    const scope = { method: ["localization", { lang, exclude, description: true }] };
    const result = await db.Subscription.scope(scope).findByPk(id, { attributes: { exclude } });
    if (!result) throw new Exception(errors.Subscription_Not_Found);
    return { data: result };
  }

  static async getAll(filters, { offset, limit, total }, lang) {
    const exclude = [];
    const result = await db.Subscription.scope({ method: ["localization", { lang, exclude, description: true }] }).customFind(
      { offset, limit, attributes: { exclude } },
      total
    );

    return result;
  }
}

module.exports = Subscription;
