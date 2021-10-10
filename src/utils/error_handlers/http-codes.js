module.exports = {
  OK: 200,
  CREATED: 201, //                      *Successful POST Request
  UPDATED: 200, //                      *Successful PUT/PATCH Request
  DELETED: 204, //                      *Successful DELETE Request
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404, //                    *API Resource NOT Found
  INTERNAL_SERVER_ERROR: 500,
};
