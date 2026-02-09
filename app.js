import express from "express";
import expressLayouts from "express-ejs-layouts";
import fs from "node:fs/promises";
import path from "node:path";
import { parsePriceToCents, validationMaxMinPrice, isString } from "./utils.js";

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

app.get("/categories/:slug", async (req, res) => {
  const { slug: categorySlug } = req.params;
  const { minPrice: minPriceQuery, maxPrice: maxPriceQuery, error } = req.query;
  console.log(minPriceQuery, maxPriceQuery, error);

  // Validar los queries Strings
  const minPrice = parsePriceToCents(minPriceQuery) ?? -Infinity; // product.price > -Infinity
  const maxPrice = parsePriceToCents(maxPriceQuery) ?? Infinity; // product.price < Infinity

  if (error === "true") {
    //validamos que los rangos de precios sean numeros
    if (minPriceQuery !== undefined && maxPriceQuery !== undefined) {
      if (isString(minPriceQuery) || isString(maxPriceQuery)) {
        return res.status(400).render("404", {
          namePage: "Error en los parámetros de precio",
          message: `Los valores de precio deben ser numéricos.`,
        });
      }
    }
  }
  // Leer mi archivo data.json
  const dataJson = await fs.readFile(DATA_PATH, "utf-8");

  // Convertir el json a objeto
  const data = JSON.parse(dataJson);

  // Desestructuramos el data en categories y products
  const { categories, products } = data;

  // Obtenemos el id de la category que el usuario clickeo
  const categoryFound = categories.find(
    (category) => category.slug.toLowerCase() === categorySlug.toLowerCase(), // tazas12345
  );

  if (!categoryFound) {
    return res.status(404).render("404", {
      namePage: "Categoria no encontrada",
      message: `No se encontró la categoría con slug "${categorySlug}"`,
    });
  }
  if (!validationMaxMinPrice(minPrice, maxPrice)) {
    return res.status(400).render("404", {
      namePage: "Error en los parámetros de precio",
      message: `El precio mínimo no puede ser mayor que el precio máximo.`,
    });
  }

  // Obtenemos todos los productos que tengan la categoria encontrada
  const productsFiltered = products.filter(
    (product) =>
      product.categoryId === categoryFound.id &&
      product.price >= minPrice &&
      product.price <= maxPrice,
  );
  const maxPriceCleaned= maxPrice === Infinity ? "" : (maxPrice / 100).toFixed(2);
  const minPriceCleaned= minPrice === -Infinity ? "" : (minPrice / 100).toFixed(2);
  res.render("category", {
    namePage: categoryFound.name,
    category: categoryFound,
    products: productsFiltered,
    minPrice: minPriceCleaned,
    maxPrice: maxPriceCleaned,
  });
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;

  // Leer mi archivo data.json
  const dataJson = await fs.readFile(DATA_PATH, "utf-8");

  // Convertir el json a objeto
  const data = JSON.parse(dataJson);

  // Desestructuramos el data en products
  const { products } = data;
  // buscar el producto por id
  const productFound = products.find((product) => product.id === Number(id));
  //validamos que el producto exista
  if (!productFound) {
    return res.status(404).render("404", {
      namePage: "Producto no encontrado",
      message: `No se encontró el producto con id "${id}"`,
    });
  }

  res.render("product", {
    namePage: productFound.name,
    product: productFound,
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
