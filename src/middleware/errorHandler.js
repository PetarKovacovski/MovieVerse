import logger from "../shared/utils/logger.js";

export default function errorHandler(err, req, res, next) {
  logger.error(err);

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error"
  });
}