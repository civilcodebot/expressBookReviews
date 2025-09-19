const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username or password is provided (hint: error if not)
  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username and password required." });
  }
  
  // Check if username is valid (available) using imported isValid
  if (!isValid(username)) {
    // Username exists (hint: mention it)
    return res.status(404).json({ message: "User already exists!" });
  }
  
  // Add new user to users array
  users.push({ username, password });
  
  // Success: User registered
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get the book list available in the shop using Promise callbacks
public_users.get('/',function (req, res) {
  // Create a promise to get books list
  const getBooksPromise = new Promise((resolve, reject) => {
    try {
      // Simulate async operation
      setTimeout(() => {
        const booksList = JSON.stringify(books, null, 2);
        resolve(JSON.parse(booksList));
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
  
  // Use promise with callbacks
  getBooksPromise
    .then((booksList) => {
      return res.status(200).json(booksList);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving books", error: error.message });
    });
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  // Create a promise to get book by ISBN
  const getBookByISBNPromise = new Promise((resolve, reject) => {
    try {
      // Simulate async operation
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
  
  // Use promise with callbacks
  getBookByISBNPromise
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
 });
  
// Task 12: Get book details based on author using Promise callbacks
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
  // Create a promise to get books by author
  const getBooksByAuthorPromise = new Promise((resolve, reject) => {
    try {
      // Simulate async operation
      setTimeout(() => {
        const matchingBooks = Object.values(books).filter(book => book.author === author);
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found for this author"));
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
  
  // Use promise with callbacks
  getBooksByAuthorPromise
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

// Task 13: Get all books based on title using Promise callbacks
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  // Create a promise to get books by title
  const getBooksByTitlePromise = new Promise((resolve, reject) => {
    try {
      // Simulate async operation
      setTimeout(() => {
        const matchingBooks = Object.values(books).filter(book => book.title === title);
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found for this title"));
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
  
  // Use promise with callbacks
  getBooksByTitlePromise
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;  // Get ISBN from URL parameter
  
  if (books[isbn]) {
    // Book found: Return its reviews object
    return res.status(200).json(books[isbn].reviews);
  } else {
    // Book not found
    return res.status(404).json({ message: "Book reviews not found" });
  }
});

module.exports.general = public_users;
