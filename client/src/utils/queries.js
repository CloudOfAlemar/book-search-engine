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
