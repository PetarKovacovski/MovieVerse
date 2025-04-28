import express from "express"
import * as c from "../controllers/customerController.js"

const router = express.Router()

router.route("/")
    .get(c.getCustomers)
    .post(c.postCustomer)
router.route("/:id")
    .get(c.getCustomer)
    .put(c.putCustomer)
    .delete(c.deleteCustomer)

export default router;