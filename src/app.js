import express from 'express';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';

import genresRouter from './genre/genreRoutes.js';
import usersRouter from './user/userRoutes.js';
import moviesRouter from './movie/movieRoutes.js';
import rentalsRouter from './rental/rentalRoutes.js';
import authRouter from './auth/authRoutes.js';

const app = express();

app.use(express.json());
app.use(logger);

app.use(express.static('public'));

app.use("/api/genres", genresRouter);
app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/rentals", rentalsRouter);
app.use("/api/auth", authRouter);

//FALLBACK FOR EVERY ROUTE
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;