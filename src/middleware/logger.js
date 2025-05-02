import morgan from "morgan";
import config from "../config/index.js";

const logger = config.isProd
  ? morgan('combined', { skip: () => true }) // disable logging in prod for now
  : morgan('dev');

export default logger;
