import mongoose from "mongoose"

function validateObjectId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send("Invalid ID format");

    next();
}

export default validateObjectId;
