import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

// 🔐 Add token to request headers
const authLink = setContext((_, { headers }) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("loginUser") : null;
  const parsed = token ? JSON.parse(token) : null;

  return {
    headers: {
      ...headers,
      "apollo-require-preflight": "true",
      authorization: parsed?.access_token
        ? `Bearer ${parsed.access_token}`
        : "",
    },
  };
});

// ❗ Safely handle auth errors on client
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (typeof window !== "undefined") {
    let shouldRedirect = false;

    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (
          err.extensions?.code === "UNAUTHENTICATED" ||
          err.message.toLowerCase().includes("unauthorized")
        ) {
          shouldRedirect = true;
        }
      }
    }

    if (
      networkError &&
      "statusCode" in networkError &&
      networkError.statusCode === 401
    ) {
      shouldRedirect = true;
    }

    if (shouldRedirect) {
      localStorage.removeItem("loginUser");
      window.location.href = "/login";
      // ⛔ Only import Router dynamically on client
      //   import('next/router').then(({ default: Router }) => {
      //     Router.push('/login');
      //   });
    }
  }
});

// 🧠 Upload support
const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
    : "http://localhost:3003/api",
  credentials: "include",
});

// 🚀 Apollo Client
const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default client;
