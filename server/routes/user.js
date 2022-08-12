import express from "express";
import { login, register, forgetPassword, resetPassword } from "../controllers/user.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/forgetpassword", forgetPassword);

router.put("/:resetToken", resetPassword);

export default router;
