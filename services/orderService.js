import * as cartService from "./cartService.js";
import * as orderRepository from "../repositories/orderRepository.js";
import * as userService from "./userService.js";

export async function processCheckout(
  cardId,
  shippingInfo,
  cart,
  userId = null,
) {
  const orderItems = cart.items.map((item) => {
    return {
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      imgSrc: item.product.imgSrc,
      quantity: item.quantity,
    };
  });

  // Verificamos si el correo del usuario coincide con algun correo de algun usuario en nuestra base de datos
  if (!userId) {
    const user = await userService.getUserByEmail(shippingInfo.email);
    userId = user ? user.id : null;
  }

  const order = {
    userId,
    items: orderItems,
    shippingInfo,
    total: cart.total,
  };

  const newOrder = await orderRepository.create(order);

  await cartService.clearCart(cardId);

  return newOrder;
}

export async function getOrderById(id) {
  await orderRepository.findById(id);
}

export async function linkPastOrderByEmail(email, userId) {
  await orderRepository.updateUserIdByEmail(email, userId);
}
