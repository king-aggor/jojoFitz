import { Router } from "express";
import * as authenticationController from "../controllers/authentication";

const router = Router();

// post create account
router.post("/register", authenticationController.createAccount);
//post login
router.post("/sign-in", authenticationController.login);

export default router;
