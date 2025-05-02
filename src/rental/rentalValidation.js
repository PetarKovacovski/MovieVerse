import Joi from "joi"

export const rentalSchema = Joi.object({
    userId: Joi.string().length(24).hex().required(),
    movieId: Joi.string().length(24).hex().required(),
});
