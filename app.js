import express from "express";
import expressLayouts from "express-ejs-layouts";
import fs from "node:fs/promises";
import path from "node:path";
import { parsePriceToCents } from "./utils.js";

// Puerto de escucha de peticiones
const PORT = 3000;

// Iniciar Servidor
const app = express();

// Parsear los datos de un formulario
app.use(express.urlencoded({ extended: false }));

// Middleware para archivos estaticos
app.use(express.static("public"));

// Para trabajar con plantillas ejs
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware para usar ejs-layouts
app.use(expressLayouts);
app.set("layout", "layout");

// Path de mi data.json
const DATA_PATH = path.join("data", "data.json"); // "./data/data.json"

// Rutas
app.get("/", (req, res) => {
  res.render("index", {
    namePage: "Inicio",
  });
});

app.get("/category/:slug", async (req, res) => {
  const { slug: categorySlug } = req.params;
  const { minPrice: minPriceQuery, maxPrice: maxPriceQuery } = req.query;

  console.log({ minPriceQuery, maxPriceQuery });

  const minPriceInCents = parsePriceToCents(minPriceQuery);
  const maxPriceInCents = parsePriceToCents(maxPriceQuery);

  let minPrice = minPriceInCents ?? -Infinity;
  let maxPrice = maxPriceInCents ?? Infinity;

  let priceRangeError = null;

  if (
    minPriceInCents !== null &&
    maxPriceInCents !== null &&
    maxPriceInCents < minPriceInCents
  ) {
    minPrice = -Infinity;
    maxPrice = Infinity;
    priceRangeError =
      "El precio máximo no puede ser menor que el precio mínimo. Mostrando todos los productos.";
  }

  const dataJson = await fs.readFile(DATA_PATH, "utf-8");

  const data = JSON.parse(dataJson);

  const { categories, products } = data;

  const categoryFind = categories.find(
    (category) => category.slug.toLowerCase() === categorySlug.toLowerCase(),
  );

  if (!categoryFind) {
    return res.status(404).render("404", {
      namePage: "Error",
    });
  }

  const productsFilter = products.filter(
    (product) =>
      product.categoryId === categoryFind.id &&
      product.price >= minPrice &&
      product.price <= maxPrice,
  );

  res.render("category", {
    namePage: categoryFind.name,
    category: categoryFind,
    products: productsFilter,
    minPrice: minPriceInCents !== null ? minPriceInCents / 100 : "",
    maxPrice: maxPriceInCents !== null ? maxPriceInCents / 100 : "",
    priceRangeError: priceRangeError,
  });
});

app.get("/product/:id", async (req, res) => {
  const productId = Number(req.params.id);

  const dataJson = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(dataJson);

  // Buscar el producto cuyo id coincida
  const product = data.products.find((p) => p.id === productId);

  // Si no existe, renderizar 404
  if (!product) {
    return res.status(404).render("404", {
      namePage: "Error",
    });
  }

  // Si existe, renderizar product pasando el producto como local
  res.render("product", {
    namePage: product.name,
    product: product,
  });
});

app.get("/cart", (req, res) => {
  res.render("cart", {
    namePage: "Carrito",
  });
});

app.get("/checkout", (req, res) => {
  res.render("checkout", {
    namePage: "Checkout",
  });
});

app.get("/order-confirmation", (req, res) => {
  res.render("order-confirmation", {
    namePage: "Confirmación de Orden",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    namePage: "Nosotros",
  });
});

app.get("/terms", (req, res) => {
  res.render("terms", {
    namePage: "Términos y Condiciones",
  });
});

app.get("/privacy", (req, res) => {
  res.render("privacy", {
    namePage: "Privacidad",
  });
});

// Escuchamos peticiones del cliente.
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
