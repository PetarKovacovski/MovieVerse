import express from "express"
import * as c from "../controllers/rentalController.js"
import validateObjectId from "../middlewares/validateObjectId.js";
const router = express.Router();

router.route("/")
    .get(c.getRentals)
    .post(c.postRental);

router.route("/:id")
    //.get(validateObjectId, c.getRental)
    //.put(validateObjectId, c.putRental) not needed now
    //.delete(validateObjectId, c.deleteRental);

export default router;