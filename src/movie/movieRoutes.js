import express from "express"
import * as c from "./movieController.js"
import validateObjectId from "../middleware/validateObjectId.js";
import isAdmin from "../middleware/isAdmin.js"
import auth from "../middleware/auth.js";
import { movieSchema } from "./movieValidation.js"
import validateBody from "../middleware/validateBody.js";
const router = express.Router();

router.route("/")
    .get(c.getMovies)
    .post(auth, isAdmin, validateBody(movieSchema), c.postMovie);

router.route("/:id")
    .get(validateObjectId, c.getMovie)
    .put(auth, isAdmin, validateObjectId, validateBody(movieSchema), c.putMovie)
    .delete(auth, isAdmin, validateObjectId, c.deleteMovie);

export default router;