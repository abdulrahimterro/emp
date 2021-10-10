const { Model } = require("sequelize");

class BaseModel extends Model {
  static async customFind(query, total) {
    let result = {};

    if (total !== undefined) {
      const { count, rows } = await this.findAndCountAll(query);
      result = { totalCount: count, data: rows };
    } else result.data = await this.findAll(query);

    return result;
  }
}

module.exports = BaseModel;
