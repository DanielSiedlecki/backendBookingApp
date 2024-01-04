import * as express from "express";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.post("/requestPassword", authController.forgotPasswordRequest);
router.post("/requestPasswordVerify", authController.requestPasswordVerify)
router.put("/changePassword", authController.changePasswordWithToken);
router.post("/logout", authController.logoutSession);

export default router;
