import * as cartService from "./cartService.js";
import * as orderRepository from "../repositories/orderRepository.js";

export async function processCheckout(cardId, shippingInfo, cart) {
  const orderItems = cart.items.map((item) => {
    return {
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      imgSrc: item.product.imgSrc,
      quantity: item.quantity,
    };
  });

  const order = {
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
