import express from "express"
import * as genreController from "../controllers/genreController.js"
const router = express.Router();

router.route("/")
    .get(genreController.getGenres)
    .post(genreController.postGenre);

router.route("/:id")
    .get(genreController.getGenre)
    .put(genreController.putGenre)
    .delete(genreController.deleteGenre);

export default router;