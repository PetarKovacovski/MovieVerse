import express from "express"
import dotenv from "dotenv"
import logger from "./middlewares/logger.js"
import genresRouter from "./routes/genres.js"
import customersRouter from "./routes/customers.js"
import moviesRouter from "./routes/movies.js"
import rentalsRouter from "./routes/rentals.js"
import mongoose from "mongoose"


dotenv.config()

try{
    await mongoose.connect("mongodb://localhost/VIDLY");
    console.log("Connected to DB");
}
catch(e){
    console.log("Error connecting to DB", e);
}

const app = express();

app.use(express.json()); 
app.use(logger)


app.get("/", (req, res)=>{
    res.send("Welcome to the API!");
});

app.use("/api/genres", genresRouter);
app.use("/api/customers", customersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/rentals", rentalsRouter);

const PORT = process.env.PORT ?? 3000;
app.listen(
    PORT,
    ()=>{
        console.log(`App running on PORT: ${PORT}`);
    }
).on('error', (err) => {
    console.error("Server failed to start:", err);
});