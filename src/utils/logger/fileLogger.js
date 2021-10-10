const moment = require("moment");
const winston = require("winston");
require("winston-daily-rotate-file");
const chalk = require("chalk");
const path = require("path");
const { SuppressType } = require("./logOptions");

const logsDirName = path.join(process.cwd(), "logs");
const successFileName = path.join(logsDirName, "success_%DATE%.log");
const warningFileName = path.join(logsDirName, "warning_%DATE%.log");
const errorFileName = path.join(logsDirName, "error_%DATE%.log");

const levels = {
  error: 0,
  warning: 1,
  success: 2,
};

/**
 * @type import('winston').Logger
 */
let fileLogger = null;

const middleware = (req, res, next) => {
  const startTime = Date.now();
  const oldJson = res.json;
  res.json = function (data) {
    res.locals.response = data;
    oldJson.call(this, data);
  };
  res.on("finish", () => {
    const { suppressType, inputMask, outputMask } = res.locals?.logOptions || {};
    if (suppressType !== SuppressType.All) {
      const log = {
        method: req.method,
        remoteAddress: req.headers["x-forwarded-for"]
          ? req.headers["x-forwarded-for"].split(",")[0]
          : req.connection.remoteAddress,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: Date.now() - startTime,
        query: req.query,
        body: req.body,
        params: req.params,
        response: res.locals.response ? res.locals.response : {},
        error: res.locals.error ? res.locals.error : {},
        userId: req.user?.id,
      };
      let level = "success";
      if (log.statusCode >= 500) level = "error";
      else if (log.statusCode >= 400) level = "warning";
      else level = "success";

      if (inputMask) _.assign(log, inputMask(log));
      if (log.statusCode < 400)
        switch (suppressType) {
          case SuppressType.OnlyResponse:
            delete log.response;
            break;
          default:
            if (outputMask) _.assign(log, outputMask(log));
            break;
        }

      fileLogger.log(level, undefined, { log });
    }
  });

  next();
};

module.exports = () => {
  if (fileLogger == null) {
    fileLogger = winston.createLogger({
      levels,
      format: winston.format.combine(
        winston.format.ms(),
        winston.format.timestamp(),
        winston.format.printf(({ level, log, timestamp, ms }) => {
          timestamp = moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
          const numRegex = /\d+/;
          const timeElapsed = parseInt(numRegex.exec(ms)[0]);
          const responseTime = log.responseTime;
          let data = _.pick(log, ["query", "params", "body"]);
          // if (log.query && Object.keys(log.query).length !== 0) data = { ...data, ...log.query };
          // if (log.body && Object.keys(log.body).length !== 0) data = { ...data, ...log.body };
          // if (log.params && Object.keys(log.params).length !== 0) data = { ...data, ...log.params };
          const logData = {
            timestamp: timestamp,
            timeElapsed,
            level,
            method: log.method,
            remoteAddress: log.remoteAddress,
            url: log.url,
            statusCode: log.statusCode,
            responseTime,
            request: data,
            response: log.response,
            error: log.error,
            userId: log.userId,
          };
          return JSON.stringify(logData);
        })
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          dirname: logsDirName,
          filename: successFileName,
          datePattern: "YYYY-MM",
          zippedArchive: false,
          maxSize: "50m",
          maxFiles: 2,
          level: "success",
        }),
        new winston.transports.DailyRotateFile({
          dirname: logsDirName,
          filename: warningFileName,
          datePattern: "YYYY-MM",
          zippedArchive: false,
          maxSize: "50m",
          maxFiles: 2,
          level: "warning",
        }),
        new winston.transports.DailyRotateFile({
          dirname: logsDirName,
          filename: errorFileName,
          datePattern: "YYYY-MM",
          zippedArchive: false,
          maxSize: "50m",
          maxFiles: 3,
          level: "error",
        }),
      ],
    });
  }

  return middleware;
};
