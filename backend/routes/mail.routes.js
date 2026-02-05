import express from "express";
import {  sendCustomMail } from "../controller/mail.controller.js";

const router = express.Router();


router.post("/send-mail", sendCustomMail);

export default router;