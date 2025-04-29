import express from "express"
import * as c from "../controllers/customerController.js"
import validateObjectId from "../middlewares/validateObjectId.js"

const router = express.Router()

router.route("/")
    .get(c.getCustomers)
    .post(c.postCustomer)
router.route("/:id")
    .get(validateObjectId, c.getCustomer)
    .put(validateObjectId, c.putCustomer)
    .delete(validateObjectId, c.deleteCustomer)

export default router;