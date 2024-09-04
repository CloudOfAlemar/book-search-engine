const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    users: [User]
    searchGoogleBooks(query: String): [Book]
    me: User
  }

  type Mutation {
    addUser(username: String, email: String, password: String): Auth
    login(email: String, password: String): Auth
    saveBook(bookInfo: BookInfo): User
  }

  input BookInfo {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }
`;

module.exports = typeDefs;
