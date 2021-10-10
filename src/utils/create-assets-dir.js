const { assetsPath } = require("../../configs");
const fs = require("fs");

module.exports = () => {
  function extract(obj) {
    Object.keys(obj).map((val) => {
      if (typeof obj[val] === "object") extract(obj[val]);
      else if (!fs.existsSync(obj[val])) fs.mkdirSync(obj[val], { recursive: true });
    });
  }
  extract(assetsPath);
};
