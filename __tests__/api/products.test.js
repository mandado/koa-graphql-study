const Product = require('../../domain/products/model');
const server = require('../../server');
const request = require('supertest');

const createProduct = (params = {}) => Product.create(Object.assign(params, {
    title: 'product 01',
    description: 'an description',
    price: 1
}));

beforeEach(async () => {
  await Product.remove({});
});

test('GET /products return empty result', async () => {
  const { body, statusCode } = await request(server.listen()).get('/products');

  expect(statusCode).toBe(200);
  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBe(0);
});

test('GET /products return one result', async () => {
  const createdProduct = await createProduct();

  const { body, statusCode } = await request(server.listen()).get('/products');

  expect(statusCode).toBe(200);
  expect(body[0].title).toBe(createdProduct.title);
  expect(body[0].description).toBe(createdProduct.description);
  expect(body[0].price).toBe(createdProduct.price);
});

test('POST /products return validation errors', async () => {
  const { body, statusCode } = await request(server.listen()).post('/products');

  expect(statusCode).toBe(422);
  expect(body.hasOwnProperty('errors')).toBeTruthy();
  expect(body.errors).toContain('"title" is required');
  expect(body.errors).toContain('"description" is required');
  expect(body.errors).toContain('"price" is required');
});

test('POST /products return created result', async () => {

  const { body, statusCode } = await request(server.listen())
                                      .post('/products')
                                      .send({ title: 'product 01', description: 'an description', price: 1 })
  
  const createdProduct = await Product.findOne();

  expect(statusCode).toBe(201);
  expect(body.title).toBe(createdProduct.title);
  expect(body.description).toBe(createdProduct.description);
  expect(body.price).toBe(createdProduct.price);
});

test('PUT /products return validation errors', async () => {
  const createdProduct = await createProduct();
  const { body, statusCode } = await request(server.listen()).put(`/products/${createdProduct._id}`);

  expect(statusCode).toBe(422);
  expect(body.hasOwnProperty('errors')).toBeTruthy();
  expect(body.errors).toContain('"title" is required');
  expect(body.errors).toContain('"description" is required');
  expect(body.errors).toContain('"price" is required');
});

test('PUT /products return id error', async () => {
  const { body, statusCode } = await request(server.listen())
                                      .put(`/products/1111`)
                                      .send({ title: 'product 02', description: 'an description1', price: 12 })
  expect(statusCode).toBe(400);
  expect(body.error).toBe('Error in try update.');
});

test('PUT /products return updated result', async () => {
  const createdProduct = await createProduct();

  const { body, statusCode } = await request(server.listen())
                                      .put(`/products/${createdProduct._id}`)
                                      .send({ title: 'product 02', description: 'an description1', price: 12 })
  
  const updatedProduct = await Product.findOne();

  expect(statusCode).toBe(200);
  expect(body.title).toBe(updatedProduct.title);
  expect(body.description).toBe(updatedProduct.description);
  expect(body.price).toBe(updatedProduct.price);
});

test('DELETE /products return id error', async () => {
  const { body, statusCode } = await request(server.listen())
                                      .del(`/products/1111`)
                                      .send({ title: 'product 02', description: 'an description1', price: 12 })
  expect(statusCode).toBe(400);
  expect(body.error).toBe('Error in try remove.');
});

test('DELETE /products return removed result', async () => {
  const createdProduct = await createProduct();

  const { body, statusCode } = await request(server.listen())
                                      .del(`/products/${createdProduct._id}`);
  
  const updatedProduct = await Product.findOne();

  expect(statusCode).toBe(200);
  expect(body.title).toBe('product 01');
  expect(body.description).toBe('an description');
  expect(body.price).toBe(1);
});