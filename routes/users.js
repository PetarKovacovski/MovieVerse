import express from "express";
import * as c from "../controllers/userController.js";
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Public registration route
router.post("/", c.postUser);

// Protect all routes below with auth
router.use(auth);

router.get("/", isAdmin, c.getUsers); // Admins only
router.get("/me", c.getUser);         // Logged-in user

export default router;
