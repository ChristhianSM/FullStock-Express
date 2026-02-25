import { Router } from "express";
import * as productController from "../controllers/productController.js";

const router = Router();

// Rutas dinámicas
router.get("/category/:slug", productController.renderProductsByCategory);

router.get("/product/:id", productController.renderProduct);

router.get("/checkout", (_req, res) => {
  res.render("checkout");
});

router.get("/order-confirmation", (_req, res) => {
  res.render("order-confirmation");
});

export default router;
