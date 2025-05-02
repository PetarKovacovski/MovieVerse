import Joi from "joi"
import Genre from "./genreModel.js"
import mongoose from "mongoose"


export async function getGenres(req, res) {
    const genres = await Genre.find({}).sort('name');
    res.send(genres);
};

export async function getGenre(req, res) {
    const id = req.params.id

    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).send(`Genre with ID ${id} not found`);
    res.send(genre);

}

export async function postGenre(req, res) {
    const { error } = Genre.joiValidate(req.body);
    if (error) return res.status(400).send(`Not a valid genre, ${error.details[0].message}`);

    const genre = new Genre({
        name: req.body.name
    });
    const dbAns = await genre.save();
    res.send(dbAns);

};

export async function putGenre(req, res) {
    const id = req.params.id

    const { error } = Genre.joiValidate(req.body);
    if (error) return res.status(400).send(`Not a valid genre, ${error.details[0].message}`);

    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).send(`Genre with ID ${id} not found`);
    genre.set({
        name: req.body.name,
    })
    const dbAns = await genre.save();
    res.send(dbAns);

};

export async function deleteGenre(req, res) {
    const id = req.params.id

    const genre = await Genre.findOneAndDelete({ _id: id });
    if (!genre) return res.status(404).send(`Genre with ID ${id} not found`);
    res.status(200).send(genre);

};
