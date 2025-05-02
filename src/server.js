import env from "./config/validateEnv.js"
import express from "express"
import logger from "./middleware/logger.js"
import genresRouter from "./genre/genreRoutes.js"
import usersRouter from "./user/userRoutes.js"
import moviesRouter from "./movie/movieRoutes.js"
import rentalsRouter from "./rental/rentalRoutes.js"
import authRouter from "./auth/authRoutes.js"
import mongoose from "mongoose"
import errorHandler from "./middleware/errorHandler.js"


try {
    await mongoose.connect(env.DB_URI);
    console.log("Connected to DB");
}
catch (e) {
    console.log("Error connecting to DB", e);
    process.exit(1)
}

const app = express();

app.use(express.json());
app.use(logger);


app.use(express.static('../public'));

app.use("/api/genres", genresRouter);
app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/rentals", rentalsRouter);
app.use("/api/auth", authRouter);
app.use(errorHandler);


app.listen(
    env.PORT,
    () => {
        console.log(`App running on PORT: ${env.PORT}`);
    }
).on('error', (err) => {
    console.error("Server failed to start:", err);
});