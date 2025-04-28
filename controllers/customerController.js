import { isObjectIdOrHexString, isValidObjectId } from "mongoose";
import Customer from "../models/customer.js";

export async function getCustomers(req, res) {
    try {
        const result = await Customer.find({});
        res.send(result);
    }
    catch (e) {
        console.log("Error loading customers from DB", e.message);
        res.sendStatus(500);
    }
}

export async function getCustomer(req, res){
    const id = req.params.id
    if (!isValidObjectId(id)) return res.status(400).send("Invalid ID format");

    try {
        const result = await Customer.findById(id);
        if(!result) return res.status(404).send("ID NOT FOUND");
        res.send(result);
    }
    catch (e) {
        console.log("Error loading customer from DB", e.message);
        res.sendStatus(500);
    }
}

export async function postCustomer(req, res) {
    const { error } = Customer.joiValidate(req.body)
    if (error) return res.status(400).send(`Not a valid customer, ${error.details[0].message}`);

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    })

    try {
        const result = await customer.save();
        res.send(result);
    }
    catch (e) {
        console.log("Error saving customer to DB", e.message);
        res.sendStatus(500);
    }
}

export async function putCustomer(req, res) {
    const id = req.params.id
    if (!isValidObjectId(id)) return res.status(400).send("Invalid ID format");

    const { error } = Customer.joiValidate(req.body)
    if (error) return res.status(400).send(`Not a valid customer, ${error.details[0].message}`);

    try{
        const updated = await Customer.findByIdAndUpdate(id, {
            $set: {
                name: req.body.name,
                isGold: req.body.isGold,
                phone: req.body.phone,
            }
        }, {new: true});
        if(!updated) return res.status(404).send("ID NOT FOUND");
        res.send(updated);
    }
    catch (e) {
        console.log("Error updating customer to DB", e.message);
        res.sendStatus(500);
    }
    
}

export async function deleteCustomer(req, res){
    const id = req.params.id
    if (!isValidObjectId(id)) return res.status(400).send("Invalid ID format");

    try{
        const deleted = await Customer.findOneAndDelete({_id : id});
        if(!deleted) return res.status(404).send("ID NOT FOUND");
        res.send(deleted);
    }
    catch(e){
        console.log("Error deleting customer from DB", e.message);
        res.sendStatus(500);
    }


}