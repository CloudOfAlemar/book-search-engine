import { gql } from "@apollo/client";

export const QUERY_GOOGLE_BOOKS = gql`
  query searchGoogleBooks($query: String) {
    searchGoogleBooks(query: $query) {
      bookId
      authors
      title
      description
      image
      link
    }
  }
`;

export const QUERY_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;
