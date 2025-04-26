import express from "express"
import dotenv from "dotenv"
import Joi from "joi"

dotenv.config()
const app = express();

app.use((req, res, next)=>{
    console.log("LOG: New request: ", req.method, req.path);
    next();
})
app.use(express.json());

const genres = [
    { id: 1 , name: "horror" }, 
    { id: 2 , name: "action" }, 
];
let lastId = genres[genres.length]?.id ?? 0;

app.get("/", (req, res)=>{
    for(let key in req){
        console.log(key)
    }
    res.send("Welcome to the API!");
});

app.get("/api/genres", (req, res)=>{
    res.send(genres);
});

app.get("/api/genres/:id", (req, res) =>{
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).send("Bad Request, id NaN");

    const genre = genres.find(g => g.id === id);
    if(!genre) return res.status(404).send(`Genre with ID ${id} not found`);

    res.send(genre);
})

app.post("/api/genres", (req, res)=>{
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(`Not a valid genre, ${error.details[0].message}`);
    lastId++; 

    const newGenre ={
        id: lastId,
        name: req.body.name
    };
    genres.push(newGenre);
    res.send(newGenre);
});

app.put("/api/genres/:id", (req, res)=>{
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).send("Bad Request, id NaN");

    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(`Not a valid genre, ${error.details[0].message}`);
    
    const genre = genres.find(g => g.id == id);
    if(!genre) return res.status(404).send(`Genre with ID ${id} not found`);

    genre.name = req.body.name;
   
    res.send(genre);
});

app.delete("/api/genres/:id", (req, res)=>{
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).send("Bad Request, id NaN");

    const idx = genres.findIndex(g => g.id == id);

    if(idx == -1) return res.status(404).send(`Genre with ID ${id} not found`);

    const deleted = genres.splice(idx, 1)[0];

    res.status(200).send(deleted);
});


function validateGenre(genre){
    const schema = Joi.object({
        "name": Joi.string().min(3).required()
    }).required();

    return schema.validate(genre);

}


const PORT = process.env.PORT ?? 3000;
app.listen(
    PORT,
    ()=>{
        console.log(`App running PORT: ${PORT}`);
    }
)