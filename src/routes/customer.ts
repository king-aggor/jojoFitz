import { Router } from "express";
import * as customerController from "../controllers/customer";

const router = Router();

//get allProducts
router.get("/products", customerController.allProducts);
//get product by id
router.get("/product/:id", customerController.getProduct);

export default router;
