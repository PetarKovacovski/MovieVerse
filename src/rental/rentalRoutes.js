import express from "express"
import * as c from "./rentalController.js"
import validateObjectId from "../middleware/validateObjectId.js";
import auth from "../middleware/auth.js";
import { rentalSchema } from "./rentalValidation.js"
import validateBody from "../middleware/validateBody.js";
const router = express.Router();

router.route("/")
    .get(c.getRentals)
    .post(auth, validateBody(rentalSchema), c.postRental); // TODO: MODIFY LOGIC INSIDE

router.route("/:id")
    //.get(validateObjectId, c.getRental)
    //.put(validateObjectId, c.putRental) not needed now
    //.delete(validateObjectId, c.deleteRental);

export default router;