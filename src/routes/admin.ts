import { Router } from "express";
import * as adminController from "../controllers/admin";

const router = Router();

//Post addCategory
router.post("/category", adminController.addCategory);
//Patch category
router.patch("/category", adminController.updateCategory);
// delete category
router.delete("/category", adminController.deleteCategory);
// Post addProduct
router.post("/product", adminController.addProduct);
//patch product
router.patch("/product", adminController.updateProduct);
//delete product
router.delete("/product", adminController.deleteProduct);

export default router;
