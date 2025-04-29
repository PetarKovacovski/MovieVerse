import express from "express"
import * as c from "../controllers/genreController.js"
import validateObjectId from "../middlewares/validateObjectId.js";
const router = express.Router();

router.route("/")
    .get(c.getGenres)
    .post(c.postGenre);

router.route("/:id")
    .get(validateObjectId, c.getGenre)
    .put(validateObjectId, c.putGenre)
    .delete(validateObjectId, c.deleteGenre);

export default router;