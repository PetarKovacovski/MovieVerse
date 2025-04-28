import mongoose, { mongo } from "mongoose"
import Joi from "joi"

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    isGold :{
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
    }
});

const Customer = mongoose.model("Customer", customerSchema);

Customer.joiValidate = function(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().required()
    });

    return schema.validate(customer);
};


export default Customer;