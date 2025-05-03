import env from "./validateEnv.js";

const config = {
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === "development",
  isProd: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
  port: env.PORT,
  dbUri: env.DB_URI,
  jwtSecret: env.JWT_SECRET
};

export default config;