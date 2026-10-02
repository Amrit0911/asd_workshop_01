const database = require('../database/productDatabase');
const { clearCache } = require('../middleware/cacheMiddleware');

async function getProducts() {
  return database.getAll();
}

async function getProductById(id) {
  const products = await database.getAll();
  return products.find((product) => product.id === id);
}

async function createProduct(productData) {
  const products = await database.getAll();
  const nextId = products.reduce((highestId, product) => Math.max(highestId, product.id), 0) + 1;
  const product = { id: nextId, ...productData };
  await database.saveAll([...products, product]);
  clearCache();
  return product;
}

async function replaceProduct(id, productData) {
  const products = await database.getAll();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) return undefined;

  const product = { id, ...productData };
  products[index] = product;
  await database.saveAll(products);
  clearCache();
  return product;
}

async function updateProduct(id, productData) {
  const products = await database.getAll();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) return undefined;

  const product = { ...products[index], ...productData, id };
  products[index] = product;
  await database.saveAll(products);
  clearCache();
  return product;
}

async function deleteProduct(id) {
  const products = await database.getAll();
  const remainingProducts = products.filter((product) => product.id !== id);

  if (remainingProducts.length === products.length) return false;

  await database.saveAll(remainingProducts);
  clearCache();
  return true;
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};
