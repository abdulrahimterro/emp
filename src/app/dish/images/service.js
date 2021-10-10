const { assetsPath } = require("../../../../configs");
const { fileUtil, errors, Exception } = require("../../../utils");
const { Op } = require("sequelize");
const sequelize = require("../../../database");

const db = sequelize.models;

class DishImage {
  constructor(data) {
    this.url = fileUtil.uri(assetsPath.dish.images, data.file);
    this.default = data.default || false;
    this.dishId = data.dishId;
    this.buffer = data.file.buffer;
  }

  static create(data) {
    return db.DishImage.bulkCreate(data || []);
  }

  saveFile() {
    return fileUtil.save(this.url, this.buffer);
  }

  static async delete(user, dishId, id) {
    await sequelize.transaction(async (transaction) => {
      const dish = await db.Dish.checkPermission(user, dishId);

      const image = dish.images.find((val) => val.id == id);
      if (!image) throw new Exception(errors.DishImage_Not_Found);

      const queries = [db.DishImage.destroy({ where: { id } })];

      if (image.default) {
        const newDefault = dish.images.find((val) => val.id != id);
        if (newDefault) queries.push(db.DishImage.update({ default: true }, { where: { id: newDefault.id } }));
      }
      await Promise.all(queries);
      await fileUtil.delete(image.url);
    });
  }

  static async defaultImage(user, dishId, id) {
    await sequelize.transaction(async (transaction) => {
      await Promise.all([
        //check user permission
        db.Dish.checkPermission(user, dishId),
        db.DishImage.update({ default: false }, { where: { dishId, id: { [Op.ne]: id } } }),
        db.DishImage.update({ default: true }, { where: { id } }),
      ]);
    });
  }
}

module.exports = DishImage;
