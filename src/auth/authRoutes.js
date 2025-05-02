import express from "express"
import { postAuth } from "./authController.js"
import validateBody from "../middleware/validateBody.js"
import { loginSchema } from "./authValidation.js"

const router = express.Router()

router.post("/", validateBody(loginSchema), postAuth) // LOGIN

export default router;