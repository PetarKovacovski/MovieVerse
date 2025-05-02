import jwt from "jsonwebtoken";
import env from "../config/validateEnv.js";

export function auth(req, res, next) {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).send("Access denied. No token provided.");
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (ex) {
        console.error("JWT verification failed:", ex.message);
        res.status(400).send("Invalid token.");
    }
}