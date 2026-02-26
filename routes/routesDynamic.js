import { Router } from "express";
import * as productController from "../controllers/productController.js";
import * as orderController from "../controllers/orderController.js";

const router = Router();

// Rutas dinámicas
router.get("/category/:slug", productController.renderProductsByCategory);

router.get("/product/:id", productController.renderProduct);

router.get("/checkout", orderController.renderCheckout);

router.post("/checkout/place-order", orderController.placeOrder);

router.get("/order-confirmation", orderController.renderOrderConfirmation);

export default router;
