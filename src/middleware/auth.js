import jwt from "jsonwebtoken";
import config from "../config/index.js";
import logger from "../shared/utils/logger.js";

export default function auth(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (ex) {
        logger.error("JWT verification failed: ");
        logger.error(ex.message);
        res.status(400).send("Invalid token.");
    }
}