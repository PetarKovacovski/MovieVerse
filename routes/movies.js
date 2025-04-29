import express from "express"
import * as c from "../controllers/movieController.js"
import validateObjectId from "../middlewares/validateObjectId.js";
const router = express.Router();

router.route("/")
    .get(c.getMovies)
    .post(c.postMovie);

router.route("/:id")
    .get(validateObjectId, c.getMovie)
    .put(validateObjectId, c.putMovie)
    .delete(validateObjectId, c.deleteMovie);

export default router;