# Movie Rental API

A basic Node.js API for managing users, authentication, movie genres, rentals, and more. Built with Express and MongoDB.

---

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/PetarKovacovski/MovieVerse
   cd MovieVerse
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.dev` file in the root:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost/MovieVerse
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

---

## Folder Structure

```
src/
│
├── auth/           # Login/register logic
├── user/           # User model, controller, routes
├── genre/          # Genre model and endpoints
├── movie/          # Movies (add/edit/list)
├── rental/         # Rental flow
├── middlewares/    # Custom middleware (auth, admin, logger)
├── config/         # Env validation, config
├── public/         # Static files
└── index.js        # Entry point
```

Each module has its own controller, model, and route file.

---

## Routes Overview

* `POST /api/auth` – login
* `GET /api/users` – list users (admin)
* `GET /api/genres` – list genres
* `POST /api/movies` – add movie
* `POST /api/rentals` – create rental

Auth is handled via JWT.

---

## Notes

* `validateEnv.js` ensures required env vars are set
* MongoDB is used for persistence
* No front-end included

---

