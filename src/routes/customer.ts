import { Router } from "express";
import * as customerController from "../controllers/customer";

const router = Router();

//get allProducts
router.get("/products", customerController.allProducts);
//get product by id
router.get("/product/:id", customerController.getProduct);
// add to cart
router.post("/cart", customerController.addToCart);
//get customer cart items
router.get("/cart", customerController.getCartItems);

export default router;
