import express from "express";
import { signup, login, ForgetPasswordWithOldPassword } from "../controller/user.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget-password", ForgetPasswordWithOldPassword);

export default router;
