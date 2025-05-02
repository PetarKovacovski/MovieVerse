import Genre from "../genre/genreModel.js";
import Movie from "./movieModel.js";

export async function getMovies(req, res) {

    const result = await Movie.find({});
    res.send(result);

}

export async function getMovie(req, res) {
    const id = req.params.id;
    const result = await Movie.findById(id);
    if (!result) return res.status(404).send("Movie ID not found");
    res.send(result);
}


export async function postMovie(req, res) {
    
    let genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(404).send("GenreID not found");

    const movie = new Movie({
        title: req.body.title,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
    });

    const result = await movie.save();
    res.send(result);
}


export async function putMovie(req, res) {
    const id = req.params.id;

    let genre = await Genre.findById(req.body.genreId)
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



export async function deleteMovie(req, res) {
    const id = req.params.id;

    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie);

}