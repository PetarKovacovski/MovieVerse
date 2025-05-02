import mongoose from "mongoose"
import Joi from "joi"

export const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5 }
})

const Genre = mongoose.model("genre", genreSchema);

export default Genre;