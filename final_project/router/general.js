const express = require("express");
let books = require("./booksdb.js");
const axios = require("axios");
const { doesExist } = require("../helper/doesExist.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// const doesExist = (username) => {
//   // Filter the users array for any user with the same username
//   let userswithsamename = users.filter((user) => {
//     return user.username === username;
//   });
//   // Return true if any user with the same username is found, otherwise false
//   if (userswithsamename.length > 0) {
//     return true;
//   } else {
//     return false;
//   }
// };

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(users, username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: "User successfully registered. Now you can login",
      });
    }
    return res.status(404).json({ message: "User already exist!" });
  }
  return res
    .status(404)
    .json({ message: "No Username or Password provided!." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  const promiseBook = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });

  const retrievedBook = JSON.stringify(await promiseBook);
  return res
    .status(200)
    .json({ message: "Successfully retrieved books", retrievedBook });
});

public_users.get("/isbn/:isbn", async (req, res) => {
  const myPromis = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      reject();
    }
    resolve(book);
  }).catch((err) => {
    return res.status(404).json({ message: "Something went wrong!" });
  });

  const answer = await myPromis;
  return res.status(200).json(answer);
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const myPromise = new Promise((resolve, reject) => {
    const authorName = req.params.author;
    const booksArr = Object.values(books);
    const book = booksArr.filter(
      (item) => item.author.toLowerCase() === authorName.toLowerCase()
    );

    if (!book.length) {
      reject({
        status: 404,
        data: null,
        message: "No book found!",
      });
    }

    resolve({
      status: 200,
      data: book,
      message: null,
    });
  }).catch((err) => {
    console.log("🚀 ~ myPromise ~ err:", err);
    return res.status(404).json(err);
  });

  const result = await myPromise;

  return res.status(200).json(result.data);
});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const myPromise = new Promise((resolve, reject) => {
    const bookTitle = req.params.title;
    const booksArr = Object.values(books);
    const book = booksArr.filter(
      (item) => item.title.toLowerCase() === bookTitle.toLowerCase()
    );

    if (!book.length) {
      reject({
        status: 404,
        data: null,
        message: "No Book Was Found!",
      });
    }

    resolve({
      status: 200,
      data: book,
      message: null,
    });
  }).catch((err) => {
    return res.status(404).json({ message: "Book with this title not found!" });
  });

  const result = await myPromise;
  if (result.status === 200) {
    return res.status(200).json(result.data);
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(300).json(book.reviews);
});

module.exports.general = public_users;
