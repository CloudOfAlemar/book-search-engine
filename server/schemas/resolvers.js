const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const fetch = require("node-fetch");

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find({});
      return users;
    },
    me: async (parent, args, context) => {
      const foundUser = await User.findOne({ _id: context.user._id });
      return foundUser;
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
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("User not found.");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error("Incorrect Password.");
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookInfo }, { user }) => {
      const foundUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: bookInfo } },
        { new: true, runValidators: true }
      );
      return foundUser;
    },
    deleteBook: async (parent, { bookId }, { user }) => {
      const foundUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true, runValidators: true }
      );
      return foundUser;
    },
  },
};

module.exports = resolvers;
