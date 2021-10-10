const fs = require("fs").promises;

module.exports = {
  uri: (path, file) => {
    return path + `${Date.now()}_${file.originalname}`;
  },
  save: async (path, buffer) => {
    await fs.writeFile(path, buffer).catch((err) => console.warn(err));
  },
  delete: async (path) => {
    path = "assets" + path?.split("assets")[1];
    await fs.unlink(path).catch((err) => console.warn(err));
  },
};
