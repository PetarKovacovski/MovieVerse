import mongoose, { mongo } from "mongoose"
import Joi from "joi"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: true, }
});

const User = mongoose.model("User", userSchema);

User.joiValidate = function (user) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().required()
    });

    return schema.validate(user);
};


export default User;