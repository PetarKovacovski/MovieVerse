import env from "./config/validateEnv.js"
import express from "express"
import logger from "./middlewares/logger.js"
import genresRouter from "./routes/genres.js"
import usersRouter from "./routes/users.js"
import moviesRouter from "./routes/movies.js"
import rentalsRouter from "./routes/rentals.js"
import authRouter from "./routes/auth.js"
import mongoose from "mongoose"


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


app.use(express.static('./public'));

app.use("/api/genres", genresRouter);
app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/rentals", rentalsRouter);
app.use("/api/auth", authRouter);

app.listen(
    env.PORT,
    () => {
        console.log(`App running on PORT: ${env.PORT}`);
    }
).on('error', (err) => {
    console.error("Server failed to start:", err);
});