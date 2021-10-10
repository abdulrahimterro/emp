/**
 * @summary transform input parameters
 * @callback inputMaskCallBack
 * @param {{query:object,param:objects,body:object}} input
 * @returns {{query:object,param:objects,body:object}}
 */

/**
 * @summary transform response body
 * @callback outputMaskCallBack
 * @param {{response:object}} output
 * @returns {{response:object}}
 */

/**
 * @description
 * Log Option made for fileLogger modification.
 * Main goal is to suppress or modify logs that will be written
 * to the fileLogger.
 *
 * @param {object} options
 * @param {SuppressType} [options.suppressType]
 * @param {inputMaskCallBack} [options.inputMask]
 * @param {outputMaskCallBack} [options.outputMask]
 */
const logOptions = (
	options = {
		suppressType: SuppressType.All,
	}
) => (req, res, next) => {
	res.locals = { ...(res.locals || {}), logOptions: options };
	next();
};

/**
 * Enum for Suppress Type values.
 * @readonly
 * @enum {String}
 */
const SuppressType = {
	NoSuppress: 'NoSuppress',
	OnlyResponse: 'OnlyResponse',
	All: 'All',
};

module.exports = {
	SuppressType,
	logOptions,
};
