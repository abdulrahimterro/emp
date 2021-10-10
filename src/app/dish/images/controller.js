const DishImage = require("./service");
const { httpCodes } = require("../../../utils");

module.exports = {
  delete: async (req, res) => {
    const { id, imageId } = req.params;
    const { user } = req;
    await DishImage.delete(user, id, imageId);
    res.sendStatus(httpCodes.DELETED);
  },

  defaultImage: async (req, res) => {
    const { id, imageId } = req.params;
    const { user } = req;
    const result = await DishImage.defaultImage(user, id, imageId);
    res.status(httpCodes.UPDATED).send(result);
  },
};
