import mongoose from "mongoose";
import Joi from "joi"

const rentalSchema = new mongoose.Schema({
    customer: {
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

Rental.joiValidate = function (rental) {
    const schema = Joi.object({
        customerId: Joi.string().length(24).hex().required(),
        movieId: Joi.string().length(24).hex().required(),
    });

    return schema.validate(rental);
}


export default Rental;
