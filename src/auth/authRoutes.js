import express from "express"
import * as c from "./authController.js"
import validateObjectId from "../middleware/validateObjectId.js"
import validateBody from "../middleware/validateBody.js"
import { loginSchema } from "./authValidation.js"

const router = express.Router()

router.post("/", validateBody(loginSchema), c.postAuth) // LOGIN

export default router;