import * as cartService from "../services/cartService.js";
import * as orderService from "../services/orderService.js";
import { AppError } from "../utils/errorUtils.js";

export async function renderCheckout(_req, res) {
  const cart = (await cartService.getCart()) || { items: [], total: 0 };

  res.render("checkout", {
    cartItems: cart.items,
    total: cart.total,
  });
}

export async function placeOrder(req, res) {
  const shippingInfo = req.body;

  const cart = await cartService.getCart();

  if (!cart || cart.items.length === 0) {
    throw new AppError(
      "Carrito no existe o no hay productos en el carrito",
      400,
    );
  }

  const order = await orderService.processCheckout(shippingInfo, cart);
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
