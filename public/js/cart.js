export function mountCart(parent) {
  parent.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Formulario donde se inicia el evento
    const form = event.target;
    const url = form.action;
    const method = form.method;

    // Construimos el body
    const formData = new FormData(form);
    const plainObject = Object.fromEntries(formData);
    const body = JSON.stringify(plainObject);

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    });

    const data = await response.json();

    // Construimos la UI en base a la data obtenida de la peticion;
    parent.innerHTML = renderCart(data.cart);
  });
}

function renderQuantityControls(item) {
  const decrementForm = `
    <form
      method="post"
      action="${item.quantity === 1 ? "/cart/delete-item" : "/cart/update-item"}"
    >
      <input
        type="hidden"
        name="productId"
        value="${item.product.id}"
      />
      <input
        type="hidden"
        name="quantity"
        value="${item.quantity - 1}"
      />
      <button
        class="button button--sm-icon button--outline"
        aria-label="Reducir cantidad"
        type="submit"
      >
        <img src="/images/icons/minus.svg" alt="Reducir cantidad" />
      </button>
    </form>
  `;

  return `
    ${decrementForm}
     <span class="cart__item-quantity-display"
        >${item.quantity}</span
      >
      <form method="post" action="/cart/update-item">
        <input
          type="hidden"
          name="productId"
          value="${item.product.id}"
        />
        <input
          type="hidden"
          name="quantity"
          value="${item.quantity + 1}"
        />
        <button
          class="button button--sm-icon button--outline"
          aria-label="Aumentar cantidad"
          type="submit"
        >
          <img src="/images/icons/plus.svg" alt="Aumentar cantidad" />
        </button>
      </form>
  `;
}

function renderCartItem(item) {
  return `
    <div
      id="${`product-${item.productId}`}"
      class="cart__item"
      data-js="cart-item"
    >
      <div class="cart__item-image">
        <img
          src="${item.product.imgSrc}"
          alt="${item.product.name}"
          class="cart__item-image-content"
        />
      </div>
      <div class="cart__item-details">
        <div class="cart__item-header">
          <h2 class="cart__item-title">${item.product.name}</h2>
          <form method="post" action="/cart/delete-item">
            <input
              type="hidden"
              name="productId"
              value="${item.product.id}"
            />
            <button
              class="button button--sm-icon button--outline"
              aria-label="Eliminar artículo"
              type="submit"
            >
              <img src="/images/icons/trash.svg" alt="Eliminar artículo" />
            </button>
          </form>
        </div>
        <div class="cart__item-footer">
          <p class="cart__item-price">
            Precio: S/ ${(item.product.price / 100).toFixed(2)}
          </p>
          <p class="cart__item-price">
            SubTotal: S/ ${item.subtotal.toFixed(2)}
          </p>

          <div class="cart__item-quantity">
            ${renderQuantityControls(item)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCart(cart) {
  const { items, total } = cart;
  return `
    <h1 class="cart__title">Carrito de compras</h1>
    <div class="cart__container">
    ${items.map(renderCartItem).join("")}

    <div class="cart__total">
        <p>Total</p>
        <p>S/ ${total.toFixed(2)}</p>
      </div>
      <div class="cart__action">
        ${
          items.length > 0
            ? `<a class="button button--lg cart__action-button" href="/checkout"
              >Continuar Compra</a>`
            : `<a class="button button--lg cart__action-button" href="/"
              >Ir a la tienda</a>`
        }
      </div>
    </div>
  `;
}
