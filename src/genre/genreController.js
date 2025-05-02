import Joi from "joi"
import Genre from "./genreModel.js"
import mongoose from "mongoose"


export async function getGenres(req, res) {
    const genres = await Genre.find({}).sort('name');
    res.send(genres);
};

export async function getGenre(req, res) {
    const id = req.params.id

    try {
        const genre = await Genre.findById(id);
        if (!genre) return res.status(404).send(`Genre with ID ${id} not found`);
        res.send(genre);
    } catch (e) {
        console.error("Error getting genre:", e.message);
        return res.sendStatus(500);
    }

}

export async function postGenre(req, res) {
    const { error } = Genre.joiValidate(req.body);
    if (error) return res.status(400).send(`Not a valid genre, ${error.details[0].message}`);

    const genre = new Genre({
        name: req.body.name
    });
    try {
        const dbAns = await genre.save();
        res.send(dbAns);
    }
    catch (e) {
        console.log("ERROR SAVING OBJ: ", e.message);
        return res.sendStatus(500);
    }
};

export async function putGenre(req, res) {
    const id = req.params.id

    const { error } = Genre.joiValidate(req.body);
    if (error) return res.status(400).send(`Not a valid genre, ${error.details[0].message}`);

    try {
        const genre = await Genre.findById(id);
        if (!genre) return res.status(404).send(`Genre with ID ${id} not found`);
        genre.set({
            name: req.body.name,
        })
        const dbAns = await genre.save();
        res.send(dbAns);
    }
    catch (e) {
        console.log("ERROR updating obj: ", e.message);
        return res.sendStatus(500);
    }
};

export async function deleteGenre(req, res) {
    const id = req.params.id

    try {
        const genre = await Genre.findOneAndDelete({ _id: id });
        if (!genre) return res.status(404).send(`Genre with ID ${id} not found`);
        res.status(200).send(genre);
    }
    catch (e) {
        console.error("Error deleting genre:", e.message);
        return res.sendStatus(500);
    }
};
