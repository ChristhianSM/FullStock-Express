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

// Middleware para definir el título de la página (namePage) en todas las vistas
const pageTitleByPath = {
  "/": "Inicio",
  "/cart": "Carrito",
  "/checkout": "Checkout",
  "/order-confirmation": "Confirmación de compra",
  "/about": "Quienes somos",
  "/terms": "Términos y Condiciones",
  "/privacy": "Política de Privacidad",
};
app.use((req, res, next) => {
  const { path } = req;
  res.locals.namePage = pageTitleByPath[path] || "Full Stock";
  next();
});

// Path de mi data.json
const DATA_PATH = path.join("data", "data.json"); // "./data/data.json"

// Rutas
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/categories/:slug", async (req, res) => {
  const { slug: categorySlug } = req.params;
  const {
    minPrice: minPriceQuery,
    maxPrice: maxPriceQuery,
    error: errorQuery,
  } = req.query;

  const showErrorUI = errorQuery === "true";

  // Validar los queries Strings
  const minPriceCents = parsePriceToCents(minPriceQuery);
  const maxPriceCents = parsePriceToCents(maxPriceQuery);

  const minPrice = minPriceCents ?? -Infinity; // product.price > -Infinity
  const maxPrice = maxPriceCents ?? Infinity; // product.price < Infinity

  // Detectar si el usuario ENVIO un query inválido
  const invalidMin = minPriceQuery !== undefined && minPriceCents === null;
  const invalidMax = maxPriceQuery !== undefined && maxPriceCents === null;

  let priceFilterError = null;

  if (invalidMin) {
    priceFilterError = "MIN_INVALID";
  } else if (invalidMax) {
    priceFilterError = "MAX_INVALID";
  } else if (minPrice > maxPrice) {
    priceFilterError = "MIN_GREATER_THAN_MAX";
  }

  const priceErrorMessages = {
    MIN_INVALID: "El precio mínimo debe ser un número válido.",
    MAX_INVALID: "El precio máximo debe ser un número válido.",
    MIN_GREATER_THAN_MAX:
      "El precio mínimo no puede ser mayor que el precio máximo.",
  };

  // Leer mi archivo data.json
  const dataJson = await fs.readFile(DATA_PATH, "utf-8");

  // Convertir el json a objeto
  const data = JSON.parse(dataJson);

  // Desestructuramos el data en categories y products
  const { categories, products } = data;

  // Obtenemos el id de la category que el usuario clickeo
  const categoryFind = categories.find(
    (category) => category.slug.toLowerCase() === categorySlug.toLowerCase(), // tazas12345
  );

  if (!categoryFind) {
    return res.status(404).render("404", {
      namePage: "Página no encontrada",
      message: "La página que estás buscando no existe o ha sido movida",
      buttonText: "Volver atrás",
    });
  }

  // Obtenemos todos los productos que tengan la categoria encontrada
  const categoryProducts = products.filter(
    (product) => product.categoryId === categoryFind.id,
  );

  if (priceFilterError && showErrorUI) {
    return res.status(400).render("404", {
      namePage: "Error en los filtros",
      message: priceErrorMessages[priceFilterError],
      buttonText: "Volver atrás",
    });
  }

  // Si los filtros de precio son válidos, aplicamos el filtro por rango
  let productsFilter = categoryProducts;
  if (!priceFilterError) {
    productsFilter = categoryProducts.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice,
    );
  }

  let noResultsMessage = '';

  // En caso no hay algun error de filtrado y el arreglo productsFilter está vacio 
  if (!priceFilterError && productsFilter.length === 0) {
    noResultsMessage = 'No hay productos que coincidan con los filtros seleccionados';
  }

  res.render("category", {
    namePage: categoryFind.name,
    category: categoryFind,
    products: productsFilter,
    noResultsMessage,
    minPrice: minPriceCents !== null ? (minPriceCents / 100).toString() : "",
    maxPrice: maxPriceCents !== null ? (maxPriceCents / 100).toString() : "",
  });
});

app.get("/products/:id", async (req, res) => {
  const { id: productId } = req.params;

  const dataJson = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(dataJson);

  const { products } = data;

  const foundProduct = products.find(
    (product) => product.id === parseInt(productId),
  );

  if (!foundProduct) {
    return res.status(404).render("404", {
      namePage: "Página no encontrada",
      message: `Producto con el id ${productId} no existe`,
      buttonText: "Volver atrás",
    });
  }

  res.render("product", {
    namePage: foundProduct.name,
    product: foundProduct,
  });
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.get("/order-confirmation", (req, res) => {
  res.render("order-confirmation");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/terms", (req, res) => {
  res.render("terms");
});

app.get("/privacy", (req, res) => {
  res.render("privacy");
});

// Escuchamos peticiones del cliente.
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
