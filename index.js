import env from "./src/config/validateEnv.js"
import express from "express"
import logger from "./src/middleware/logger.js"
import genresRouter from "./src/genre/genreRoutes.js"
import usersRouter from "./src/user/userRoutes.js"
import moviesRouter from "./src/movie/movieRoutes.js"
import rentalsRouter from "./src/rental/rentalRoutes.js"
import authRouter from "./src/auth/authRoutes.js"
import mongoose from "mongoose"
import errorHandler from "./src/middleware/errorHandler.js"


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


app.use(express.static('./src/public'));

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