const moment = require("moment");
const path = require("path");
const lineReader = require("reverse-line-reader");
const fs = require("fs").promises;
class LogQueryService {
  static async getLogs(criteria) {
    let {
      fromDate,
      toDate,
      minTimeElapsed,
      maxTimeElapsed,
      minResponseTime,
      maxResponseTime,
      level,
      method,
      remoteAddress,
      url,
      excludeUrl,
      statusCode,
      text,
      noResponse,
      noParams,
      textSearch,
      limit,
      userId,
    } = criteria;
    let logs = [];
    let scanned = 0;
    let done = false;
    let lineScanner = function (line) {
      let log;
      try {
        log = JSON.parse(line);
        ++scanned;
      } catch (error) {
        return true;
      }

      log.timestamp = new Date(log.timestamp);
      if (log.timestamp < fromDate) return !(done = true);

      if (
        (toDate && log.timestamp > toDate) ||
        (userId && log.userId != userId) ||
        (minTimeElapsed && log.timeElapsed < minTimeElapsed) ||
        (maxTimeElapsed && log.timeElapsed > maxTimeElapsed) ||
        (minResponseTime && log.responseTime < minResponseTime) ||
        (maxResponseTime && log.responseTime > maxResponseTime) ||
        //(level && log.level !== level) ||
        (method && log.method !== method) ||
        (remoteAddress && log.remoteAddress !== remoteAddress) ||
        (url && !log.url.startsWith(url)) ||
        (excludeUrl && log.url.startsWith(excludeUrl)) ||
        (statusCode && log.statusCode != statusCode) ||
        (textSearch && !line.toLocaleLowerCase().includes(textSearch))
      )
        return true;

      if (noResponse) delete log.response;
      if (noParams) delete log.request;
      logs.push(log);
      if (logs.length >= limit) return !(done = true);
    };
    // let eachLine = promises.promisify(lineReader.eachLine);

    if (textSearch) textSearch = textSearch.toLocaleLowerCase();
    try {
      const filterRegex = new RegExp(`^${level || "success"}[\\d\\-_]+\\.log(\\.\\d+)?$`);
      const logFiles = await fs.readdir(path.join(process.cwd(), "logs")).then((files) =>
        files
          .filter((f) => filterRegex.test(f))
          .sort()
          .reverse()
      );
      for (let file of logFiles) {
        await lineReader.eachLine(path.join(process.cwd(), "logs", file), lineScanner);
        if (done) break;
      }
    } catch (e) {
      console.log(e);
    }

    let results = logs;
    if (text) results = this.convertToText(results, scanned);

    return results;
  }

  static async convertToText(logs, scanned) {
    let result = [`${scanned} entries scanned , ${logs.length} log entries matched  `];

    logs.forEach((log) => {
      const timestamp = moment(log.timestamp).format("YYYY-MM-DD HH:mm:ss");
      const remoteAddress = log.remoteAddress.padStart(15);
      const responseTime = log.responseTime + "ms";
      // response error and response data and request data
      result.push("*****************************************");
      result.push(
        `${timestamp}  ${log.timeElapsed}  ${log.level}: ${log.method}  ${remoteAddress} user#${log.userId ?? "###"}  ${
          log.url
        }  ${log.statusCode}  ${responseTime}`
      );
      if (log.request && !_.isEmpty(log.request)) {
        result.push("PARAMETERS :");
        result.push(`${JSON.stringify(log.request, null, "\t")}`);
      }
      if (log.error && !_.isEmpty(log.error)) {
        result.push("ERROR :");
        result.push(log.error.msg);
        if (log.error.stack) result.push(...log.error.stack);
        if (log.error.originalError) result.push("ORIGINAL ERROR:\n" + JSON.stringify(log.error.originalError, null, 4));
      } else if (log.response && !_.isEmpty(log.response)) {
        result.push("RESPONSE :");
        result.push(`${JSON.stringify(log.response, null, "\t")}\n`);
      }
    });

    return result.join("\n");
  }
}
module.exports = LogQueryService;
