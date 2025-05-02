import express from "express";
import { postUser, getUsers, getUser } from "./userController.js";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import { registerSchema } from "./userValidation.js";
import validateBody from "../middleware/validateBody.js";
const router = express.Router();

// Public registration route
router.post("/", validateBody(registerSchema), postUser);

// Protect all routes below with auth
router.use(auth);

router.get("/", isAdmin, getUsers); // Admins only
router.get("/me", getUser);         // Logged-in user

export default router;
