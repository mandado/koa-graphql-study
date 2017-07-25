const {makeExecutableSchema} = require('graphql-tools');

const Product = require('./domain/products/model');

const typeDefs = `
    type Product {
        id: ID!
        title: String!
        description: String!
        price: Float!
    }

    input ProductInput {
        title: String!
        description: String!
        price: Float!
    }

    type Query {
        allProducts: [Product!]!
    }

    type Mutation {
        createProduct(title: String!, description: String!, price: Float!): Product
        updateProduct(id: ID!, input: ProductInput!): Product
        deleteProduct(id: ID!): Product
    }
`;

const resolvers = {
    Query: {
        allProducts: async () => {
            return await Product.find({});
        },
    },
    Mutation: {
        createProduct: async (_ , data) => {
            return await Product.create(data);
        },
        updateProduct: async (_ , data) => {
            const { id } = data;
            const dataUpdated = await Product.findOneAndUpdate({ _id : id }, { $set: data.input }, {new: true});

            return dataUpdated;
        },
        deleteProduct: async (_ , data) => {
            const { id } = data;
            const dataRemoved = await Product.findOneAndRemove({ _id: id });
            
            return dataRemoved;
        }
    },
    Product: {
        id: root => root._id || root.id,
    },
};

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
});
