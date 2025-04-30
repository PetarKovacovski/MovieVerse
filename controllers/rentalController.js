import Customer from "../models/customer.js";
import Movie from "../models/movie.js";
import Rental from "../models/rental.js";
import mongoose from "mongoose"

export async function getRentals(req, res) {
    const result = await Rental.find({});
    return res.send(result);
}
export async function postRental(req, res) {

    const { error } = Rental.joiValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { customerId, movieId } = req.body;


    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const customer = await Customer.findById(customerId).session(session);
        const movie = await Movie.findById(movieId).session(session);
        if (!customer || !movie) return res.status(404).send("Customer or Movie ID not found");

        if (movie.numberInStock == 0) return res.status(400).send("Movie is out of stock.");

        const rental = new Rental({
            customer: {
                _id: customerId,
                name: customer.name,
            },
            movie: {
                _id: movieId,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        });

        movie.numberInStock--;

        await movie.save({ session });
        const saved = await rental.save({ session })
        await session.commitTransaction();

        res.send(saved);
    }
    catch (e) {
        await session.abortTransaction();
        session.endSession();
        console.error("Transaction failed:", e);
        res.status(500).send("Internal Server Error");

    }
    finally {
        session.endSession();
    }

}
