import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../src/config/index.js";

export function generateToken(isAdmin = false) {
  return jwt.sign(
    { _id: new mongoose.Types.ObjectId(), isAdmin },
    config.jwtSecret
  );
}
