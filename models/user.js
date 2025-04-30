import mongoose, { mongo } from "mongoose"
import Joi from "joi"
import argon2 from "argon2";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, minlength: 3, maxlength: 255, lowercase: true, unique: true },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
});

userSchema.methods.toJSON = function () {
    //const {  name, email } = this; return this; -> just pick some things
    //this removes the password each time
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    return obj;
};
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    try {
      this.password = await argon2.hash(this.password);
      next();
    } catch (err) {
      next(err);
    }
  });


const User = mongoose.model("User", userSchema);

User.joiValidate = function (user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(255).email().required(),
        password: Joi.string().min(3).max(255).required() // Don't allow raw input over 255
    });
    return schema.validate(user);
};


export default User;