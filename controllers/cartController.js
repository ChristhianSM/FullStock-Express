import * as cartService from "../services/cartService.js";
import * as productService from "../services/productService.js";
import { setCookie } from "../utils/cookiesUtils.js";
import { AppError } from "../utils/errorUtils.js";

export async function renderCart(req, res) {
  const cartId = req.cartId;
  const { items, total } = await cartService.getCart(cartId);

  res.render("cart", {
    cartItems: items,
    total: total,
  });
}

export async function addItemToCart(req, res) {
  const cartId = req.cartId; // 4
  const userId = req.user?.id;
  const productId = parseInt(req.body.productId);

  const productFinded = await productService.getProductById(productId);

  if (!productFinded) {
    throw new AppError(
      "El producto seleccionado no se encuentra disponible",
      404,
    );
  }

  const cart = await cartService.addItemToCart(cartId, productId, userId);

  if (!cartId || cartId !== cart.id) {
    setCookie(res, "cartId", cart.id, { signed: true });
  }

  res.redirect(`/product/${productId}`);
}

export async function updateItemToCart(req, res) {
  const cartId = req.cartId;
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

  await cartService.updateItemToCart(cartId, productId, quantity);
  res.redirect("/cart");
}

export async function deleteItemToCart(req, res) {
  const cartId = req.cartId;
  const productId = parseInt(req.body.productId);

  const productFinded = await productService.getProductById(productId);

  if (!productFinded) {
    throw new AppError(
      "El producto seleccionado no se encuentra disponible",
      404,
    );
  }

  await cartService.deleteItemToCart(cartId, productId);
  res.redirect("/cart");
}
