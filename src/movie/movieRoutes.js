import express from "express"
import { deleteMovie, getMovie, getMovies, postMovie, putMovie } from "./movieController.js"
import validateObjectId from "../middleware/validateObjectId.js";
import isAdmin from "../middleware/isAdmin.js"
import auth from "../middleware/auth.js";
import { movieSchema } from "./movieValidation.js"
import validateBody from "../middleware/validateBody.js";
const router = express.Router();

router.route("/")
    .get(getMovies)
    .post(auth, isAdmin, validateBody(movieSchema), postMovie);

router.route("/:id")
    .get(validateObjectId, getMovie)
    .put(auth, isAdmin, validateObjectId, validateBody(movieSchema), putMovie)
    .delete(auth, isAdmin, validateObjectId, deleteMovie);

export default router;