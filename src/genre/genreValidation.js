import Joi from "joi"
export const genreSchema = Joi.object({
    name: Joi.string().min(5).required()
});

