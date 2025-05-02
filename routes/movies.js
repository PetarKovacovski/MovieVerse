import express from "express"
import * as c from "../controllers/movieController.js"
import validateObjectId from "../middlewares/validateObjectId.js";
import isAdmin from "../middlewares/isAdmin.js"
import auth from "../middlewares/auth.js";

const router = express.Router();

router.route("/")
    .get(c.getMovies)
    .post(auth, isAdmin, c.postMovie);

router.route("/:id")
    .get(validateObjectId, c.getMovie)
    .put(auth, isAdmin, validateObjectId, c.putMovie)
    .delete(auth, isAdmin, validateObjectId, c.deleteMovie);

export default router;