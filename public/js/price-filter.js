// Obtenemos el formulario y los productos
const formFilter = document.querySelector("form[data-js='form-filter']");
const productsCard = document.querySelectorAll("a[data-js='product-card']");

formFilter.addEventListener("submit", (event) => {
  event.preventDefault();
  const { minPrice, maxPrice } = event.currentTarget.elements;
  const min = minPrice.value ? parseFloat(minPrice.value) : 0;
  const max = maxPrice.value ? parseFloat(maxPrice.value) : Infinity;

  productsCard.forEach((productCard) => {
    const price = parseFloat(productCard.dataset.price);
    const isVisible = price >= min && price <= max;
    productCard.dataset.visible = isVisible;
  });

  // Actualizar URL, para filtrado
  const url = new URL(window.location);

  if (minPrice.value) {
    url.searchParams.set("minPrice", minPrice.value);
  } else {
    url.searchParams.delete("minPrice");
  }

  if (maxPrice.value) {
    url.searchParams.set("maxPrice", maxPrice.value);
  } else {
    url.searchParams.delete("maxPrice");
  }

  window.history.pushState({}, "", url);
});
