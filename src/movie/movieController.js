import Genre from "../genre/genreModel.js";
import Movie from "./movieModel.js";

export async function getMovies(req, res) {
    try {
        const result = await Movie.find({});
        res.send(result);
    }
    catch (e) {
        console.log("Error loading movies from DB", e.message);
        res.sendStatus(500);
    }
}

export async function getMovie(req, res) {
    const id = req.params.id;

    try {
        const result = await Movie.findById(id);
        if (!result) return res.status(404).send("Movie ID not found");
        res.send(result);
    }
    catch (e) {
        console.log("Error quering for Movies", e.message);
        res.sendStatus(500);
    }
}


export async function postMovie(req, res) {
    const { error } = Movie.joiValidate(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let genre;
    try {
        genre = await Genre.findById(req.body.genreId)
        if (!genre) return res.status(404).send("GenreID not found");
    }
    catch (e) {
        console.log("Error quering for Genre");
        return res.sendStatus(500);
    }

    const movie = new Movie({
        title: req.body.title,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
    });

    try {
        const result = await movie.save();
        res.send(result);
    }
    catch (e) {
        console.log("Error saving Movie", e);
        res.sendStatus(500);
    }
}


export async function putMovie(req, res) {
    const id = req.params.id;

    const { error } = Movie.joiValidate(req.body)
    if (error) return res.status(400).send(error.details[0].message);


    let genre;
    try {
        genre = await Genre.findById(req.body.genreId)
        if (!genre) return res.status(404).send("GenreID not found");

        const result = await Movie.findOneAndUpdate({ _id: id }, {
            $set: {
                title: req.body.title,
                dailyRentalRate: req.body.dailyRentalRate,
                genre: {
                    _id: genre._id,
                    name: genre.name,
                },
                numberInStock: req.body.numberInStock,
            }
        }, { new: true });

        if (!result) return res.status(404).send("MovieID not found");
        res.send(result);
    }
    catch (e) {
        console.log("Error updating movie", e.message);
        return res.sendStatus(500);
    }

}



export async function deleteMovie(req, res) {
    const id = req.params.id;

    try {
        const movie = await Movie.findByIdAndDelete(id);
        if (!movie) return res.status(404).send('The movie with the given ID was not found.');

        res.send(movie);
    }
    catch(e){
        console.log("Error delete", e.message);
        return res.sendStatus(500);
    }
 
}