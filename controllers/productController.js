import * as categoryService from "../services/categoryService.js";
import * as productService from "../services/productService.js";
import { AppError } from "../utils/errorUtils.js";
import { parsePriceToCents } from "../utils/utils.js";

export async function renderProductsByCategory(req, res) {
  const { slug } = req.params;
  const { minPrice: minPriceQuery, maxPrice: maxPriceQuery } = req.query;

  // Validar los queries Strings
  const minPrice = parsePriceToCents(minPriceQuery); // Null o el valor;
  const maxPrice = parsePriceToCents(maxPriceQuery);

  const minPriceValue = minPrice !== null ? minPrice : -Infinity;
  const maxPriceValue = maxPrice !== null ? maxPrice : Infinity;

  const category = await categoryService.getCategoryBySlug(slug);

  if (!category) {
    throw new AppError(
      "La categoría que esta buscando no se encuentra disponible",
      404,
    );
  }

  const products = await productService.getProductsByCategory(category.id);

  const productsWithVisibility = products.map((product) => {
    const isVisible =
      product.price >= minPriceValue && product.price <= maxPriceValue;
    return {
      ...product,
      isVisible,
    };
  });

  res.render("category", {
    namePage: category.name,
    category,
    products: productsWithVisibility,
    minPrice: minPriceQuery || "",
    maxPrice: maxPriceQuery || "",
  });
}

export async function renderProduct(req, res) {
  const id = parseInt(req.params.id);

  // Buscamos el producto por su ID
  const productFinded = await productService.getProductById(id);

  if (!productFinded) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.render("product", {
    namePage: "Producto",
    product: productFinded,
  });
}
