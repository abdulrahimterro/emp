const errors = require("./error_handlers/errors");
const Exception = require("./error_handlers/exception");

module.exports = (allowedPermissions) => (req, res, next) => {
  const permissions = req.user.permissions;
  // check if user has any of the given permissions
  if (!allowedPermissions) next();
  else if (permissions.includes(1)) next();
  else if (permissions.find((val) => allowedPermissions.includes(val))) next();
  else throw new Exception(errors.Invalid_Request_Permission);
};
