const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const existingUser = users.find(usr => usr.username === username);
    return !existingUser;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const existingUser = users.find(usr => usr.username === username && usr.password === password);
    return existingUser;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const payload = req.body;

  if (!authenticatedUser(payload.username, payload.password)) {
    return res.status(401).json({message: "Unauthorized!"});
  }

  const token = jwt.sign(payload, "testing_key_123");

  return res.status(200).json({token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.user;
  
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(400).json({message: "Book not found!"});
  }

  const payload = req.body;

  book.reviews[user.username] = {
    comment: payload.comment,
    rating: payload.rating,
  };

  return res.status(200).json({book});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.user;
  
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(400).json({message: "Book not found!"});
  }

  if (book.reviews[user.username]) {
    delete book.reviews[user.username];
  }

  return res.status(200).json({message: "review deleted!"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
