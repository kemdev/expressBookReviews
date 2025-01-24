const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  // return users.some((user) => user.username === username);
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  // Return true if any valid user is found, otherwise false
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(200)
      .json({ message: "Password or username not provided!" });
  }

  // Auth
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  }

  return res
    .status(208)
    .json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review; // string
  const username = req.session.authorization.username;
  const selectedBook = books[isbn];
  //Write your code here

  selectedBook.reviews[username] = review;

  if (!review) {
    return res.status(208).json({ message: "No review added" });
  }
  console.log("🚀 ~ regd_users.put ~ selectedBook:", selectedBook);

  return res.status(200).json({
    message: `Review from ${username} has been updated to the book with title ${selectedBook.title}`,
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.session.authorization.username;
  const book = books[isbn];

  if (book) {
    delete book.reviews[user];
    return res.status(200).json({
      message: `Deleted review from ${user} for the book ${book.title}`,
    });
  }

  return res.status(404).json({ message: "Book not found!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
