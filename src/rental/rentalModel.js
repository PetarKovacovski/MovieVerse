import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
    },
    movie: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        dailyRentalRate: { type: Number, required: true }
    },
    dateRented: {type: Date, default: Date.now},
    dateReturned: Date,
    rentalFee: { type: Number, min: 0, default: 0 }
})

const Rental = mongoose.model("Rental", rentalSchema);

export default Rental;
