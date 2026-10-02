const productService = require('../services/productService');

function getId(request) {
  const id = Number(request.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function getProducts(request, response, next) {
  try {
    response.json(await productService.getProducts());
  } catch (error) {
    next(error);
  }
}

async function getProductById(request, response, next) {
  try {
    const id = getId(request);
    if (id === null) return response.status(400).json({ message: 'Invalid product id' });

    const product = await productService.getProductById(id);
    if (!product) return response.status(404).json({ message: 'Product not found' });

    response.json(product);
  } catch (error) {
    next(error);
  }
}

async function createProduct(request, response, next) {
  try {
    const { name, price } = request.body;
    if (!name || price === undefined) {
      return response.status(400).json({ message: 'name and price are required' });
    }

    response.status(201).json(await productService.createProduct({ name, price }));
  } catch (error) {
    next(error);
  }
}

async function replaceProduct(request, response, next) {
  try {
    const id = getId(request);
    if (id === null) return response.status(400).json({ message: 'Invalid product id' });

    const { name, price } = request.body;
    if (!name || price === undefined) {
      return response.status(400).json({ message: 'name and price are required' });
    }

    const product = await productService.replaceProduct(id, { name, price });
    if (!product) return response.status(404).json({ message: 'Product not found' });

    response.json(product);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(request, response, next) {
  try {
    const id = getId(request);
    if (id === null) return response.status(400).json({ message: 'Invalid product id' });

    const product = await productService.updateProduct(id, request.body);
    if (!product) return response.status(404).json({ message: 'Product not found' });

    response.json(product);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(request, response, next) {
  try {
    const id = getId(request);
    if (id === null) return response.status(400).json({ message: 'Invalid product id' });

    const deleted = await productService.deleteProduct(id);
    if (!deleted) return response.status(404).json({ message: 'Product not found' });

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct,
};
