module.exports = (query) => {
  const pagination = _.pick(query, ["offset", "limit", "total"]);
  query = _.omit(query, ["offset", "limit", "total"]);

  pagination.offset = pagination.offset ? Number(pagination.offset) : 0;
  pagination.limit = pagination.limit ? Number(pagination.limit) : 200;

  return { pagination, query };
};
