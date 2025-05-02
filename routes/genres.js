import express from "express"
import * as c from "../controllers/genreController.js"
import validateObjectId from "../middlewares/validateObjectId.js";
import isAdmin from "../middlewares/isAdmin.js"
import auth from "../middlewares/auth.js";
const router = express.Router();

router.route("/")
    .get(c.getGenres)
    .post(auth, isAdmin, c.postGenre);

router.route("/:id")
    .get(validateObjectId, c.getGenre)
    .put(auth, isAdmin, validateObjectId, c.putGenre)
    .delete(auth, isAdmin, validateObjectId, c.deleteGenre);

export default router;