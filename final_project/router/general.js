const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const user = req.body;
  
  if (!user.username || !user.password) {
    return res.status(400).json({message: "Credentials are not provided."});
  }

  if (!isValid(user.username)) {
    return res.status(400).json({message: "The username already exists."});
  }

  users.push(user);

  return res.status(201).json(user);
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  const task = new Promise((resolve, reject) => {
    setTimeout(() => {
        const allBooks = Object.keys(books).map((key) => {
            return {
                id: key,
                ...books[key]
            }
        });

        resolve(allBooks)
    }, 500);
  })

  const allBooks = await task;
     
  return res.status(200).send(JSON.stringify(allBooks));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const task = new Promise((resolve, reject) => {
    setTimeout(() => {
        const book = books[req.params.isbn];

        if (!book) {
            reject("Book not found");
        }

        resolve(book);
    }, 500);
  });

  try {
    const book = await task;

    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).send(err);
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const task = new Promise((resolve, reject) => {
    setTimeout(() => {
        const filteredBooks = Object.entries(books)
            .filter(([id, book]) => book.author === req.params.author)
            .map(([id, book]) => {
                return {
                    isbn: id,
                    ...book
                }
            });

        if (!filteredBooks.length) {
            reject("Book not found");
        }

        resolve(filteredBooks[0]);
    }, 500);
  });

  try {
    const book = await task;

    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).send(err);
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const task = new Promise((resolve, reject) => {
        setTimeout(() => {
            const filteredBooks = Object.entries(books)
                .filter(([id, book]) => book.title === req.params.title)
                .map(([id, book]) => {
                    return {
                        isbn: id,
                        ...book
                    }
                });

            if (!filteredBooks.length) {
                reject("Book not found");
            }

            resolve(filteredBooks[0]);
        }, 500);
        });

        try {
        const book = await task;

        return res.status(200).json(book);
        } catch (err) {
        return res.status(404).send(err);
        }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books[req.params.isbn];

    if (!book) {
      return res.status(404).send("Book not found");
    }
  
    return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
