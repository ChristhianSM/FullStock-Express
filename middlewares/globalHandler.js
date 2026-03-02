import { find } from "../repositories/cartRepository.js";

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
  const cartId = req.cartId;
  res.locals.namePage = pageTitleByPath[path] || "Full Stock";

  // Leer mi cart de acuerdo a su id
  const cartFinded = await find(cartId);

  res.locals.countCartProducts = cartFinded
    ? cartFinded.items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  next();
}
