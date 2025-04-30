import express from "express"
import * as c from "../controllers/authController.js"
import validateObjectId from "../middlewares/validateObjectId.js"

const router = express.Router()

router.post("/", c.postAuth) // LOGIN

export default router;