const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User registered successfully"
    });
});

public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (result.length > 0) {
        return res.status(200).json(result);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (result.length > 0) {
        return res.status(200).json(result);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });
});

// Get all books using Axios + async/await
async function getAllBooks() {
    const response = await axios.get("http://localhost:5000/");
    return response.data;
}


// Get book by ISBN using Axios + async/await
async function getBookByISBN(isbn) {
    const response = await axios.get(
        `http://localhost:5000/isbn/${isbn}`
    );
    return response.data;
}


// Get books by author using Axios + async/await
async function getBooksByAuthor(author) {
    const response = await axios.get(
        `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
    return response.data;
}


// Get books by title using Axios + async/await
async function getBooksByTitle(title) {
    const response = await axios.get(
        `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
    return response.data;
}


// Export router and Axios functions
module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;