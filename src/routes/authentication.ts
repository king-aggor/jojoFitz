import { Router } from "express";
import * as authenticationController from "../controllers/authentication";

const router = Router();

// post create admin
router.post("/register/", authenticationController.createAccount);

export default router;
