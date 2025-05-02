import express from "express"
import * as c from "./movieController.js"
import validateObjectId from "../middleware/validateObjectId.js";
import isAdmin from "../middleware/isAdmin.js"
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/")
    .get(c.getMovies)
    .post(auth, isAdmin, c.postMovie);

router.route("/:id")
    .get(validateObjectId, c.getMovie)
    .put(auth, isAdmin, validateObjectId, c.putMovie)
    .delete(auth, isAdmin, validateObjectId, c.deleteMovie);

export default router;