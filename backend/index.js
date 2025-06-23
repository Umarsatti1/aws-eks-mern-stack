import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import bookRoutes from "./routes/bookRoutes.js"; // Importing book routes
import cors from 'cors';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (request, response) => {
  console.log(request);
  return response.status(200).send('Hello World!');
});

// Middleware to handle CORS
app.use(cors()); // Enable CORS for all routes

app.use('/books', bookRoutes); // Using book routes

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });