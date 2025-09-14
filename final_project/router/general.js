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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // Return the full list of books as neatly formatted JSON
  const booksList = JSON.stringify(books, null, 2);  // null is replacer (none), 2 is indent spaces
  return res.status(200).json(JSON.parse(booksList));  // Parse back to object for res.json()
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]){
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;  // Get author from URL parameter
  
  // Get all book objects as an array and filter by author
  const matchingBooks = Object.values(books).filter(book => book.author === author);
  
  if (matchingBooks.length > 0) {
    // Books found: Return array as JSON
    return res.status(200).json(matchingBooks);
  } else {
    // No matches
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;  // Get title from URL parameter
  
  // Filter book objects by title
  const matchingBooks = Object.values(books).filter(book => book.title === title);
  
  if (matchingBooks.length > 0) {
    // Books found: Return array as JSON
    return res.status(200).json(matchingBooks);
  } else {
    // No matches
    return res.status(404).json({ message: "No books found for this title" });
  }
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
