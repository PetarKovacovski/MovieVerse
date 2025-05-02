import mongoose from "mongoose"

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

export default Movie;