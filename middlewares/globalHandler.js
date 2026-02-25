import { getData } from "../data/db.js";

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

export async function globalHandler(req, res, next) {
  const path = req.path;
  res.locals.namePage = pageTitleByPath[path] || "Full Stock";

  // Leer mi archivo data.json
  const data = await getData();

  if (!data.carts) {
    data.carts = [];
  }

  res.locals.countCartProducts = data.carts[0]
    ? data.carts[0].items.reduce((total, item) => total + item.quantity, 0)
    : 0;
  next();
}
