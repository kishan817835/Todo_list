import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:   process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Mail error:", error.message);
    console.log("Check your .env file for EMAIL_USER and EMAIL_PASS");
  } else {
    console.log(" Mail server ready");
  }
});

export default transporter;
