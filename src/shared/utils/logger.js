import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, errors } = format;

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

const devFormat = combine(
  colorize({ all: true }),
  timestamp(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

const logger = createLogger({
    level: isTest ? "error" : "info", // only log errors in tests
    format: prodFormat,
    transports: [
      new transports.Console({
        silent: process.env.NODE_ENV === "test",
        format: isDev ? devFormat : prodFormat
      }),
      ...(isProd
        ? [
            new transports.File({ filename: "logs/error.log", level: "error" }),
            new transports.File({ filename: "logs/combined.log" })
          ]
        : [])
    ],
    exitOnError: false
  });
  

process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception");
    logger.error(err);
    process.exit(1);
  });

process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:");
    logger.error(reason);
    process.exit(1); // OR CONTINUE
});


export default logger;
