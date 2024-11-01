import { Router } from "express";
import * as customerController from "../controllers/customer";

const router = Router();

//get allProducts
router.get("/products", customerController.allProducts);

export default router;
