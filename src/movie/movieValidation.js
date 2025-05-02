import Joi from "joi"

export const movieSchema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.string().length(24).hex().required(),
    numberInStock: Joi.number().required().positive(),
    dailyRentalRate: Joi.number().required().positive()
});