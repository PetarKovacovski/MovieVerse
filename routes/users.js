import express from "express"
import * as c from "../controllers/userController.js"
import validateObjectId from "../middlewares/validateObjectId.js"
import auth from "../middlewares/auth.js"
import isAdmin from "../middlewares/auth.js"

const router = express.Router()

router.route("/")
    .get(auth, isAdmin, c.getUsers)
    .post(c.postUser) // REGISTER
router.route("/me").get(auth, c.getUser);

export default router;