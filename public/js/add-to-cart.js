import { updatebadge } from "/js/header.js";

const formAddProductToCart = document.querySelector(
  "form[data-js='add-to-cart-form']",
);

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

      // Incrementar el contador del carrito de manera visual
      updatebadge(data.cart);

      buttonAddToCart.disabled = false;
      buttonAddToCart.textContent = textOriginalButton;
    } catch (error) {
      console.error(error);
      form.submit();
    }
  });
}
