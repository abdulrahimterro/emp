/**
 *
 * @param  {...function} fns
 */

module.exports = (...fns) => (req, res, next) => fns.map((fn) => fn(req, res, next).catch(next));
