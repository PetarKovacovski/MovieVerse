import logger from "../shared/utils/logger.js";

export default function requestLogger(req, res, next) {
  const start = process.hrtime();

  res.on("finish", () => {
    const [sec, ns] = process.hrtime(start);
    const ms = (sec * 1000 + ns / 1e6).toFixed(1);

    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms} ms`);
  });

  next();
}
