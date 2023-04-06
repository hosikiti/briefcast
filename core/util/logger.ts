import * as log from "https://deno.land/std@0.182.0/log/mod.ts";

const filename = "/logs/core.log";

const formatter = (logRecord: log.LogRecord) => {
  const { datetime, levelName, msg } = logRecord;

  // Format date
  const d = new Date(datetime.getTime() - datetime.getTimezoneOffset() * 6e4);
  const logTime = d.toISOString().slice(0, -5) +
    d.toString().replace(/^.*GMT([-+]\d{2})(\d{2}).*$/, "$1:$2");

  return `${logTime} ${levelName}\t${msg}`;
};

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter,
    }),

    file: new log.handlers.RotatingFileHandler("DEBUG", {
      filename,
      formatter,
      maxBackupCount: 7,
      maxBytes: 1024 * 1024 * 1024,
    }),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "file"],
    },
  },
});

// get default logger
const logger = log.getLogger();

export { logger };
