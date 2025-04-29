import mongoose from "mongoose"
import Joi from "joi"

export const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5 }
})

const Genre = mongoose.model("genre", genreSchema);

Genre.joiValidate = function (genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });
    return schema.validate(genre);
}


export default Genre;