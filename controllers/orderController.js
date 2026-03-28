import z from "zod";
import { orderSchema } from "../public/js/shared/orderSchema.js";
import * as cartService from "../services/cartService.js";
import * as orderService from "../services/orderService.js";
import { AppError } from "../utils/errorUtils.js";

export async function renderCheckout(req, res) {
  const cardId = req.cartId;
  const cart = await cartService.getCart(cardId);

  res.render("checkout", {
    cartItems: cart.items,
    total: cart.total,
    errors: {},
    values: {},
  });
}

export async function placeOrder(req, res) {
  const cardId = req.cartId;
  const userId = req.user?.id;

  const result = orderSchema.safeParse(req.body);

  if (!result.success) {
    const cart = await cartService.getCart(cardId);
    const fieldsErrors = z.flattenError(result.error).fieldErrors;

    return res.render("checkout", {
      cartItems: cart.items,
      total: cart.total,
      errors: fieldsErrors,
      values: req.body,
    });
  }

  const shippingInfo = result.data;

  const cart = await cartService.getCart(cardId);

  if (!cart || cart.items.length === 0) {
    throw new AppError(
      "Carrito no existe o no hay productos en el carrito",
      400,
    );
  }

  const order = await orderService.processCheckout(
    cardId,
    shippingInfo,
    cart,
    userId,
  );
  const orderId = order.id;

  res.redirect(`/order-confirmation?orderId=${orderId}`);
}

export async function renderOrderConfirmation(req, res) {
  const orderId = parseInt(req.query.orderId);

  if (!orderId || isNaN(orderId)) {
    throw new AppError("Order No valida", 400);
  }

  const orderFinded = orderService.getOrderById(orderId);

  if (!orderFinded) {
    throw new AppError("No se encuentra la orden buscada", 400);
  }

  res.render("order-confirmation", {
    orderId,
  });
}
