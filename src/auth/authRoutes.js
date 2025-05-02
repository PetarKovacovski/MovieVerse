import express from "express"
import * as c from "./authController.js"
import validateObjectId from "../middleware/validateObjectId.js"

const router = express.Router()

router.post("/", c.postAuth) // LOGIN

export default router;