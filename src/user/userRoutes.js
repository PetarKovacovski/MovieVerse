import express from "express";
import * as c from "./userController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import { registerSchema } from "./userValidation.js";
import validateBody from "../middleware/validateBody.js";
const router = express.Router();

// Public registration route
router.post("/", validateBody(registerSchema), c.postUser);

// Protect all routes below with auth
router.use(auth);

router.get("/", isAdmin,  c.getUsers); // Admins only
router.get("/me", c.getUser);         // Logged-in user

export default router;
