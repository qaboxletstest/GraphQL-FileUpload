const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {
  GraphQLUpload,
  graphqlUploadExpress, // A Koa implementation is also exported.
} = require('graphql-upload');
const fs = require("fs")
const path = require("path")

const typeDefs = gql`
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type File {
    url: String!
  }

  type Query {
    hello: String!
  }

  type Mutation {
    singleUploadFile(file: Upload!): File!
    multipleUploadFile (files: [Upload]!) : [File]!
  }
`;

const resolvers = {
  Upload: GraphQLUpload,

  Query: {
    hello: () => 'Hello World'
  },

  Mutation: {
    singleUploadFile: async (parent, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      const out = fs.createWriteStream(path.join(__dirname, `/FileUpload/${filename}`));
      await stream.pipe(out);
      return {
        url: `http://localhost:4000/FileUpload/${filename}`
      };
    },
    multipleUploadFile: async (parent, args) => {
      let obj = (await Promise.all(args.files)).map(async (file) => {
        const { createReadStream, filename, mimetype, encoding } = await file;
        const stream = createReadStream();
        const out = fs.createWriteStream(path.join(__dirname, `/FileUpload/${filename}`));
        await stream.pipe(out);
        return {
          url: `http://localhost:4000/FileUpload/${filename}`
        };
      });
      return obj
    }
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  const app = express();

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  server.applyMiddleware({ app });

  await new Promise(r => app.listen({ port: 4000 }, r));

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startServer();
