import express from "express"
import { getGenre, getGenres, postGenre, putGenre, deleteGenre } from "./genreController.js"
import validateObjectId from "../middleware/validateObjectId.js";
import isAdmin from "../middleware/isAdmin.js"
import auth from "../middleware/auth.js";
import validateBody from "../middleware/validateBody.js";
import { genreSchema } from "./genreValidation.js";
const router = express.Router();

router.route("/")
    .get(getGenres)
    .post(auth, isAdmin, validateBody(genreSchema), postGenre);

router.route("/:id")
    .get(validateObjectId, getGenre)
    .put(auth, isAdmin, validateObjectId, validateBody(genreSchema), putGenre)
    .delete(auth, isAdmin, validateObjectId, deleteGenre);

export default router;