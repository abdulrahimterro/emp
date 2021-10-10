const { jwt } = require("../../configs");
const { sign } = require("jsonwebtoken");

/**
 * Json web tokens generator
 *
 * @param {object} user
 * @returns {object} {access_token, refresh_token}
 */

module.exports = (user) => {
  const payload = { id: user.id };

  const accessToken = sign(payload, jwt.access.key, { expiresIn: jwt.access.duration });
  const refreshToken = sign(payload, jwt.refresh.key, { expiresIn: jwt.refresh.duration });

  return { accessToken, refreshToken };
};
