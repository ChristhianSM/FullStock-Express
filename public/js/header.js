export function updatebadge(cart) {
  const cartLink = document.querySelector("[data-js='cart-link']");
  let badgeCart = cartLink.querySelector("[data-js='cart-badge']");

  // Incrementar el contador del carrito de manera visual
  const cartCountProducts = cart.items.reduce(
    (acc, value) => acc + value.quantity,
    0,
  );

  if (cartCountProducts > 0) {
    if (!badgeCart) {
      badgeCart = document.createElement("span");
      badgeCart.className = "header-actions__cart-badge";
      badgeCart.dataset.js = "cart-badge";
      cartLink.append(badgeCart);
    }

    badgeCart.textContent = cartCountProducts;
  } else if (badgeCart) {
    badgeCart.remove();
  }
}
