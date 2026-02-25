import * as cartService from "../services/cartService.js";
import * as productService from "../services/productService.js";
import { AppError } from "../utils/errorUtils.js";

export async function renderCart(_req, res) {
  const { items, total } = await cartService.getCart();

  res.render("cart", {
    cartItems: items,
    total: total,
  });
}

export async function addItemToCart(req, res) {
  const productId = parseInt(req.body.productId);

  const productFinded = await productService.getProductById(productId);

  if (!productFinded) {
    throw new AppError(
      "El producto seleccionado no se encuentra disponible",
      404,
    );
  }

  await cartService.addItemToCart(productId);

  res.redirect(`/product/${productId}`);
}

export async function updateItemToCart(req, res) {
  const productId = parseInt(req.body.productId);
  const quantity = parseInt(req.body.quantity);

  const productFinded = await productService.getProductById(productId);

  if (!productFinded) {
    throw new AppError(
      "El producto seleccionado no se encuentra disponible",
      404,
    );
  }

  if (isNaN(quantity) || quantity < 0) {
    throw new AppError("La cantidad Ingresada es incorrecta", 400);
  }

  await cartService.updateItemToCart(productId, quantity);
  res.redirect("/cart");
}

export async function deleteItemToCart(req, res) {
  const productId = parseInt(req.body.productId);

  const productFinded = await productService.getProductById(productId);

  if (!productFinded) {
    throw new AppError(
      "El producto seleccionado no se encuentra disponible",
      404,
    );
  }

  await cartService.deleteItemToCart(productId);
  res.redirect("/cart");
}
