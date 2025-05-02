import express from "express"
import * as c from "./genreController.js"
import validateObjectId from "../middleware/validateObjectId.js";
import isAdmin from "../middleware/isAdmin.js"
import auth from "../middleware/auth.js";
import validateBody from "../middleware/validateBody.js";
import { genreSchema } from "./genreValidation.js";
const router = express.Router();

router.route("/")
    .get(c.getGenres)
    .post(auth, isAdmin, validateBody(genreSchema), c.postGenre);

router.route("/:id")
    .get(validateObjectId, c.getGenre)
    .put(auth, isAdmin, validateObjectId, validateBody(genreSchema), c.putGenre)
    .delete(auth, isAdmin, validateObjectId, c.deleteGenre);

export default router;