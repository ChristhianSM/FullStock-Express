const formAddProductToCart = document.querySelector(
  "form[data-js='add-to-cart-form']",
);
const cartLink = document.querySelector("[data-js='cart-link']");
let badgeCart = cartLink.querySelector("[data-js='cart-badge']");

if (formAddProductToCart) {
  formAddProductToCart.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Feedback visual
    const form = event.currentTarget;
    const url = form.action;
    const buttonAddToCart = event.submitter;
    const textOriginalButton = buttonAddToCart.textContent;

    buttonAddToCart.disabled = true;
    buttonAddToCart.textContent = "Agregando...";

    // Convertir los datos del input a formato JSON
    const formData = new FormData(form);
    const plainObjectForm = Object.fromEntries(formData);
    const body = JSON.stringify(plainObjectForm);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      const data = await response.json();

      if (!badgeCart) {
        badgeCart = document.createElement("span");
        badgeCart.className = "header-actions__cart-badge";
        badgeCart.dataset.js = "cart-badge";
        cartLink.append(badgeCart);
      }

      // Incrementar el contador del carrito de manera visual
      const cartCountProducts = data.cart.items.reduce(
        (acc, value) => acc + value.quantity,
        0,
      );

      badgeCart.textContent = cartCountProducts;

      buttonAddToCart.disabled = false;
      buttonAddToCart.textContent = textOriginalButton;
    } catch (error) {
      console.error(error);
      form.submit();
    }
  });
}
