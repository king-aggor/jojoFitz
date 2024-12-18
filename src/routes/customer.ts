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
//remove cart item
router.delete("/cart", customerController.removeCartItem);
//place order
router.post("/order", customerController.placeOrder);
//get all customer orders
router.get("/orders", customerController.orders);
//get order by id
router.get("/order/:orderId", customerController.order);
//webhook
router.post("/webhook", customerController.webhook);

export default router;
