import * as productRepository from "../repositories/productRepository.js";

export async function getProductsByCategory(categoryId) {
  const products = await productRepository.findAll();

  // Obtenemos todos los productos que tengan la categoria encontrada
  const productsFilter = products.filter(
    (product) => product.categoryId === categoryId,
  );

  return productsFilter;
}

export async function getProductById(productId) {
  const product = await productRepository.findById(productId);
  return product;
}
