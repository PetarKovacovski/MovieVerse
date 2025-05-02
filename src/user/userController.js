import { isObjectIdOrHexString, isValidObjectId } from "mongoose";
import User from "./userModel.js";


export async function postUser(req, res) {
    const { error } = User.joiValidate(req.body)
    if (error) return res.status(400).send(`Not a valid user, ${error.details[0].message}`);

    const { name, password } = req.body;
    const email = req.body.email.toLowerCase(); // lowercase safely

    const existingUser = await User.findOne({ email: email });
    if (existingUser) return res.status(400).send("Email already registered.");

    const user = new User({ name, email, password,})

    try {
        const result = await user.save(); // password hashed in pre("save")
        res.send(result); // safe due to toJSON override
    }
    catch (e) {
        console.log("Error saving user to DB", e.message);
        res.sendStatus(500);
    }
}


export async function getUsers(req, res) {
    try {
        const result = await User.find({});
        res.send(result);
    }
    catch (e) {
        console.log("Error loading users from DB", e.message);
        res.sendStatus(500);
    }
}

export async function getUser(req, res){

    const id = req.user._id;
    try {
        const result = await User.findById(id);
        if(!result) return res.status(404).send("ID NOT FOUND");
        res.send(result);
    }
    catch (e) {
        console.log("Error loading user from DB", e.message);
        res.sendStatus(500);
    }
}


// export async function putUser(req, res) {
//     const id = req.params.id
//     if (!isValidObjectId(id)) return res.status(400).send("Invalid ID format");

//     const { error } = User.joiValidate(req.body)
//     if (error) return res.status(400).send(`Not a valid user, ${error.details[0].message}`);

//     try{
//         const updated = await User.findByIdAndUpdate(id, {
//             $set: {
//                 name: req.body.name,
//                 isGold: req.body.isGold,
//                 phone: req.body.phone,
//             }
//         }, {new: true});
//         if(!updated) return res.status(404).send("ID NOT FOUND");
//         res.send(updated);
//     }
//     catch (e) {
//         console.log("Error updating user to DB", e.message);
//         res.sendStatus(500);
//     }
    
// }

// export async function deleteUser(req, res){
//     const id = req.params.id
//     if (!isValidObjectId(id)) return res.status(400).send("Invalid ID format");

//     try{
//         const deleted = await User.findOneAndDelete({_id : id});
//         if(!deleted) return res.status(404).send("ID NOT FOUND");
//         res.send(deleted);
//     }
//     catch(e){
//         console.log("Error deleting user from DB", e.message);
//         res.sendStatus(500);
//     }
// }