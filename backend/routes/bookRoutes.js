import express from 'express';
import { Book } from '../models/bookModels.js'; // Assuming you have a book model defined

const app = express.Router();

// Route for creating a new book
app.post('/', async (request, response) => {
    try {
        if (!request.body.title || !request.body.author || !request.body.publishedYear || !request.body.genre) {
            return response.status(400).send("Input validation failed: Missing required fields");
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishedYear: request.body.publishedYear,
            genre: request.body.genre,
        };
        const book = await Book.create(newBook);
        return response.status(201).json(book);
        
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: "Error creating book", error: error.message });
    }
});

// Route for getting all books
app.get('/', async (request, response) => {
    try {
        const books = await Book.find();
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: "Error fetching books", error: error.message });
    }
});

// Route for getting a single book by ID
app.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const book = await Book.findById(id);
        const books = await Book.find();
        return response.status(200).json(book || { message: "Book not found." });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: "Error fetching books", error: error.message });
    }
});

// Route for updating a book by ID
app.put('/:id', async (request, response) => {
    try {
        if (!request.body.title || !request.body.author || !request.body.publishedYear || !request.body.genre) {
            return response.status(400).send("Input validation failed: Missing required fields");
        }
        const { id } = request.params;
        const updatedBook = await Book.findByIdAndUpdate(id, request.body);
        if (!updatedBook) {
            return response.status(404).json({ message: "Book not found." });
        }
        return response.status(200).json({
            message: "Book updated successfully!",
            data: updatedBook
        });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: "Error updating book", error: error.message });
    }
});

// Route for deleting a book by ID
app.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return response.status(404).json({ message: "Book not found." });
        }
        return response.status(200).json({
            message: "Book deleted successfully!",
        });
    } catch (error) {
        console.log(error.message);
        return response.status(500).send({ message: "Error deleting book", error: error.message });
    }
});

export default app;