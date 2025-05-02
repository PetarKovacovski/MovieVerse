import User from "../models/user.js";
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import env from "../config/validateEnv.js"

export async function postAuth(req, res) {
    const { error } = User.joiValidateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const email = req.body.email.toLowerCase();
    const { password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password.");
    
    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(400).send("Invalid email or password.");

    const token = jwt.sign(user.toJSON(), env.JWT_SECRET);

    res.send(token);

}