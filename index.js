const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} = require('graphql');
const fs = require('fs');

const cors = require('cors');

const app = express();

const corsOptions = {
  origin: '*',
  methods: '*',
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    position: { type: new GraphQLList(GraphQLInt) },
    value: { type: GraphQLString },
  }),
});

const PageType = new GraphQLObjectType({
  name: 'Page',
  fields: () => ({
    pageIndex: { type: GraphQLInt },
    content: { type: GraphQLString },
    tokens: { type: new GraphQLList(TokenType) }, 
  }),
});

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    title: { type: GraphQLString },
    author: { type: GraphQLString },
    pages: { type: new GraphQLList(PageType) },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { title: { type: GraphQLString } },
      resolve(parent, args) {
        const bookData = fs.readFileSync('./src/resources/book.json', 'utf8');
        const parsedBookData = JSON.parse(bookData);

        parsedBookData.pages = parsedBookData.pages.map((page) => {
          if (!page.tokens) {
            page.tokens = [];
          }
          return page;
        });

        return parsedBookData;
      },
    },
    book1: {
      type: BookType,
      args: { title: { type: GraphQLString } },
      resolve(parent, args) {
        const bookData = fs.readFileSync('./src/resources/book2.json', 'utf8');
        const parsedBookData = JSON.parse(bookData);

      
        parsedBookData.pages = parsedBookData.pages.map((page) => {
          if (!page.tokens) {
            page.tokens = [];
          }
          return page;
        });

        return parsedBookData;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log('GraphQL server is running on http://localhost:4000/graphql');
});


// const express = require('express');
// const { graphqlHTTP } = require('express-graphql');
// const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
// const fs = require('fs');

// const cors = require('cors'); 

// const app = express();


// const corsOptions = {
//   origin: '*',
//   methods: '*',
//   optionsSuccessStatus: 204, 
// };

// app.use(cors(corsOptions));



// const BookType = new GraphQLObjectType({
//   name: 'Book',
//   fields: () => ({
//     title: { type: GraphQLString },
//     author: { type: GraphQLString },
//     pages: { type: new GraphQLList(PageType) },
//     tokens: { type: new GraphQLList(TokenType) },

//   }),
// });

// const TokenType = new GraphQLObjectType({
//   name: 'Token',
//   fields: () => ({
//     position: { type: new GraphQLList(GraphQLInt) },
//     value: { type: GraphQLString },
//   }),
// });


// const PageType = new GraphQLObjectType({
//   name: 'Page',
//   fields: () => ({
//     pageIndex: { type: GraphQLInt },
//     content: { type: GraphQLString },
//     tokens: { type: new GraphQLList(TokenType) }, // Add this line to include tokens

//   }),
// });

// const RootQuery = new GraphQLObjectType({
//   name: 'RootQueryType',
//   fields: {
//     book: {
//       type: BookType,
//       args: { title: { type: GraphQLString } },
//       resolve(parent, args) {
//         const bookData = fs.readFileSync('./src/resources/book.json', 'utf8');
//         return JSON.parse(bookData);
//       },
//     },
//     book1: {
//       type: BookType,
//       args: { title: { type: GraphQLString } },
//       resolve(parent, args) {
//         const bookData = fs.readFileSync('./src/resources/book2.json', 'utf8');
//         return JSON.parse(bookData);
//       },
//     },
//   },
// });

// const schema = new GraphQLSchema({
//   query: RootQuery,
// });

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     graphiql: true, 
//   })
// );

// app.listen(4000, () => {
//   console.log('GraphQL server is running on http://localhost:4000/graphql');
// });
