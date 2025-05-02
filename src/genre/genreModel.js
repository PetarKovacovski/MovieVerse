import mongoose from "mongoose"

export const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5 }
})

const Genre = mongoose.model("genre", genreSchema);

export default Genre;