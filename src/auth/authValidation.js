import Joi from "joi";

export const loginSchema = Joi.object({
    email: Joi.string().min(3).max(255).email().required(),
    password: Joi.string().min(3).max(255).required()
});