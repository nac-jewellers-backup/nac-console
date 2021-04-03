import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { getMainDefinition } from "apollo-utilities";
const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphiql" || "http://api.dev.pinecrow.com/graphql",
});

const link = split(({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === "OperationDefinition" && operation === "subscription";
}, httpLink);

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = localStorage.getItem('auth_token');
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...  ,
//       authorization: token ? `Bearer ${token}` : "",
//     }
//   }
// });

// link : authLink.concat(link),
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
