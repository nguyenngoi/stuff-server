require('winston-daily-rotate-file');
const { existsSync, mkdirSync } = require('fs');
const { createLogger, transports, format } = require('winston');

module.exports = ({ config }) => {

  const tsFormat = () => (new Date()).toLocaleTimeString();
  const LOG_DIR = `${process.cwd()}/${config.logging.dir}`;
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR);
  }
  
  const logger = createLogger({
    format: format.combine(
      format.colorize(),
      format.simple(),
      format.timestamp(),
    ),
    transports: [
      new (transports.Console)({
        timestamp: tsFormat,
        level: config.logging.level,
        label: 'test',
        colorize: true,
      }),
      new (transports.DailyRotateFile)({
        filename: `${LOG_DIR}/%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        level: config.logging.level,
        timestamp: tsFormat,
      })
    ]
  });

  return logger;
}