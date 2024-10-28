import { Router } from "express";
import * as adminController from "../controllers/admin";

const router = Router();

//Post addCategory
router.post("/category", adminController.addCategory);
// Post addProduct
router.post("/product", adminController.addProduct);

export default router;
