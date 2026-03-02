import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";

export async function getCart(cartId) {
  const cart = (await cartRepository.find(cartId)) || { id: 1, items: [] };

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

// Modifica addItemToCart(cartId, productId):

// Primero, intenta buscar el carrito con cartRepository.find(cartId).
// Si cart es null (no existe o cartId era undefined), crea uno nuevo usando cartRepository.create().
// Procede a agregar el producto al carrito encontrado (o recién creado).
// Retorna el carrito actualizado.

export async function addItemToCart(cartId, productId) {
  const cart = await cartRepository.find(cartId);

  if (!cart) {
    const newCart = await cartRepository.create();

    newCart.items.push({ productId, quantity: 1 });

    const updateCart = await cartRepository.update(newCart);

    return updateCart;
  }

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

export async function updateItemToCart(cartId, productId, quantity) {
  const cart = await cartRepository.find(cartId);

  const cartItem = cart.items.find(
    (product) => product.productId === productId,
  );

  if (cartItem) {
    cartItem.quantity = quantity;
  }

  const updateCart = await cartRepository.update(cart);

  return updateCart;
}

export async function deleteItemToCart(cartId, productId) {
  const cart = await cartRepository.find(cartId);

  // Filtramos el producto que deseamos eliminar del carrito de compras
  cart.items = cart.items.filter((item) => item.productId !== productId);

  await cartRepository.update(cart);

  return cart;
}

export async function clearCart(cartId) {
  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  cart.items = [];

  await cartRepository.update(cart);
}
