import express from "express"
import dotenv from "dotenv"
import Joi from "joi"
import logger from "./middlewares/logger.js"
import genresRouter from "./routes/genres.js"

dotenv.config()
const app = express();

app.use(express.json()); 
app.use(logger)


app.get("/", (req, res)=>{
    res.send("Welcome to the API!");
});

app.use("/api/genres", genresRouter);


const PORT = process.env.PORT ?? 3000;
app.listen(
    PORT,
    ()=>{
        console.log(`App running on PORT: ${PORT}`);
    }
).on('error', (err) => {
    console.error("Server failed to start:", err);
});