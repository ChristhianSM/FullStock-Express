import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";

export async function getCart() {
  const cart = (await cartRepository.find()) || { id: 1, items: [] };

  const products = await productRepository.findAll();

  // Modificar los items del carrito de compras
  const cartItemsDetailed = cart.items.map((item) => {
    const product = products.find((product) => product.id === item.productId);

    //hallando subtotal de cada producto
    const subtotal = (product.price * item.quantity) / 100;

    return {
      ...item,
      product,
      subtotal,
    };
  });

  //  calculando en total del carrito
  const total = cartItemsDetailed.reduce(
    (acumulador, item) => acumulador + item.subtotal,
    0,
  );

  return {
    items: cartItemsDetailed,
    total,
  };
}

export async function addItemToCart(productId) {
  const cart = (await cartRepository.find()) || { id: 1, items: [] };

  // Buscamos el producto que el usuario agrego al carrito de compras
  const cartItem = cart.items.find(
    (product) => product.productId === productId,
  ); // { productId: 2, quantity: 1 }

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  const updateCart = await cartRepository.update(cart);

  return updateCart;
}

export async function updateItemToCart(productId, quantity) {
  const cart = (await cartRepository.find()) || { id: 1, items: [] };

  const cartItem = cart.items.find(
    (product) => product.productId === productId,
  );

  if (cartItem) {
    cartItem.quantity = quantity;
  }

  const updateCart = await cartRepository.update(cart);

  return updateCart;
}

export async function deleteItemToCart(productId) {
  const cart = (await cartRepository.find()) || { id: 1, items: [] };

  // Filtramos el producto que deseamos eliminar del carrito de compras
  cart.items = cart.items.filter((item) => item.productId !== productId);

  await cartRepository.update(cart);

  return cart;
}
