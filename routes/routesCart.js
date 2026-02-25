import { Router } from "express";
import * as cartController from "../controllers/cartController.js";

const router = Router();

router.get("/", cartController.renderCart);

router.post("/add-product", cartController.addItemToCart);

router.post("/update-item", cartController.updateItemToCart);

router.post("/delete-item", cartController.deleteItemToCart);

export default router;
