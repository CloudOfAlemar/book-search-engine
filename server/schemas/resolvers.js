const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const fetch = require("node-fetch");

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find({});
      return users;
    },
    searchGoogleBooks: async (parent, { query }) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&key=AIzaSyDtJokZnrDFn6Cr1MB2h3y88s7lm4zbJ_s`
        );

        const { items } = await response.json();

        const books = items.map((book) => {
          return {
            bookId: book.id,
            authors: book.volumeInfo.authors || ["No author to display"],
            title: book.volumeInfo.title,
            description: book.volumeInfo.description,
            image: book.volumeInfo.imageLinks?.thumbnail || "",
            link: book.selfLink,
          };
        });
        return books;
      } catch (error) {
        throw new Error("Failed to fetch book data.");
      }
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
