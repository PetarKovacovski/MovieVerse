import mongoose from "mongoose"
import Joi from "joi"
import { genreSchema } from "../genre/genreModel.js";
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, minLength: 5, maxLength: 255 },
    genre: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
    },
    numberInStock: { type: Number, required: true },
    dailyRentalRate: { type: Number, required: true }
}
)
const Movie = mongoose.model("Movie", movieSchema);

Movie.joiValidate = function (movie) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.string().length(24).hex().required(),
        numberInStock: Joi.number().required().positive(),
        dailyRentalRate: Joi.number().required().positive()
    });

    return schema.validate(movie);
}


export default Movie;