import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).email().required(),
    password: Joi.string().min(3).max(255).required() // Don't allow raw input over 255
});
