import express from "express"
import * as c from "../controllers/userController.js"
import validateObjectId from "../middlewares/validateObjectId.js"

const router = express.Router()

router.route("/")
    .get(c.getUsers)
    .post(c.postUser) // REGISTER
router.route("/:id")
    //.get(validateObjectId, c.getUser)
    //.put(validateObjectId, c.putUser)
    //.delete(validateObjectId, c.deleteUser)

export default router;