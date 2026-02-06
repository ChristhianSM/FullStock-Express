import express from "express";
import expressLayouts from "express-ejs-layouts";
import fs from "node:fs/promises";
import path from "node:path";

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
  res.locals.namePage = pageTitleByPath[req.path] || "Full Stock";
  next();
});

// Path de mi data.json
const DATA_PATH = path.join("data", "data.json"); // "./data/data.json"

// Rutas
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/category/:slug", async (req, res) => {
  const { slug: categorySlug } = req.params;

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
    });
  }

  // Obtenemos todos los productos que tengan la categoria encontrada
  const productsFilter = products.filter(
    (product) => product.categoryId === categoryFind.id,
  );

  res.render("category", {
    namePage: categoryFind.name,
    category: categoryFind,
    products: productsFilter,
  });
});

app.get("/products/:id", async (req, res) => {
  const { id: productId } = req.params;
  console.log("product id: ", productId);

  const dataJson = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(dataJson);

  const { products } = data;

  const product = products.find(
    (product) => product.id === parseInt(productId),
  );

  if (!product) {
    return res.status(404).render("404", {
      namePage: "Página no encontrada",
      message: `Producto con el id ${productId} no existe`,
    });
  }

  res.render("product", {
    namePage: product.name,
    product,
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
