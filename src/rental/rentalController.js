import User from "../user/userModel.js";
import Movie from "../movie/movieModel.js";
import Rental from "./rentalModel.js";
import mongoose from "mongoose"

export async function getRentals(req, res) {
    const result = await Rental.find({}).sort("-dateRented");
    return res.send(result);
}
export async function postRental(req, res) {

    const { error } = Rental.joiValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { userId, movieId } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findById(userId).session(session);
        const movie = await Movie.findById(movieId).session(session);
        if (!user || !movie) return res.status(404).send("User or Movie ID not found");

        if (movie.numberInStock == 0) return res.status(400).send("Movie is out of stock.");

        const rental = new Rental({
            user: {
                _id: userId,
                name: user.name,
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
        throw (err);
    }
    finally {
        session.endSession();
    }

}
