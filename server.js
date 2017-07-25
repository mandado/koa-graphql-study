const Koa = require('koa');
const koaBody = require('koa-body');
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const Router = require('koa-router');
const mongoose = require('mongoose');

const products = require('./modules/products/route');

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/products');

const app = new Koa();
const router = Router();
const myGraphQLSchema = require('./schema');

app.use(koaBody());
app.use(products.routes());
app.use(router.routes());

// koaBody is needed just for POST.
router.post('/graphql', graphqlKoa({ schema: myGraphQLSchema }));
router.get('/graphql', graphqlKoa({ schema: myGraphQLSchema }));

router.post('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));
router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }));


module.exports = app;