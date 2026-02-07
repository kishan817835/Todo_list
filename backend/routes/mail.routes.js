import express from "express";
import {  sendCustomMail } from "../controller/mail.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();


router.use(auth);

router.post("/send-mail", sendCustomMail);



export default router;