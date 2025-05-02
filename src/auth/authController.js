import User from "../user/userModel.js";
import argon2 from "argon2"


export async function postAuth(req, res) {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password.");
    
    const valid = await argon2.verify(user.password, password);
    if (!valid) return res.status(400).send("Invalid email or password.");

    const token = user.generateJWTToken();

    res.send(token);
}