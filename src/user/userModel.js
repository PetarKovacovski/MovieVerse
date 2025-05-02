import mongoose, { mongo } from "mongoose"
import argon2 from "argon2";
import jwt from "jsonwebtoken"
import env from "../config/validateEnv.js"
import { JWT_EXPIRES_IN } from "../shared/constants.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, minlength: 3, maxlength: 255, lowercase: true, unique: true },
  password: { type: String, required: true, minlength: 3, maxlength: 1024 },
  isAdmin: { type: Boolean, default: false },
});

userSchema.methods.toJSON = function () {
  //const {  name, email } = this; return this; -> just pick some things
  //this removes the password each time
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

userSchema.methods.generateJWTToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password);
  next();
});

const User = mongoose.model("User", userSchema);


export default User;