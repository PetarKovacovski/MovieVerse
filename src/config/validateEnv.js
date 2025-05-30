import Joi from "joi";
import logger from "../shared/utils/logger.js";

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().min(10).required(),
  DB_URI: Joi.string().uri().required()
}).unknown(); // allow other non-validated vars

const { error, value: env } = envSchema.validate(process.env);

if (error) {
  logger.error("Invalid environment configuration:");
  logger.error(error.message);
  process.exit(1);
}

export default env;
