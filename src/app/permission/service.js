const db = require("../../database").models;
const { Op } = require("sequelize");

class Permission {
  constructor(data) {}

  static async getAll(user, filters, { offset, limit, total }, lang) {
    const conditions = (() => {
      const result = {};

      const maxPermission = Math.max(user.permissions) - user.isSuper;
      if (filters.invite) result["id"] = { [Op.gt]: maxPermission };

      return result;
    })();
    const result = await db.Permission.scope({ method: ["localization", { lang }] }).customFind({ where: conditions }, total);
    return result;
  }
}

module.exports = Permission;
