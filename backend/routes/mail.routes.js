import express from "express";
import {  sendCustomMail } from "../controller/mail.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/send-mail", auth, sendCustomMail);


export default router;