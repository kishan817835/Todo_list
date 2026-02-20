import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  sendMail: async ({ from, to, subject, html, text }) => {
    try {
      const response = await resend.emails.send({
        from: from || `"Upsoma Consultancy" <onboarding@resend.dev>`,
        to: [to],
        subject,
        html: html || text,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  verify: (callback) => {
    if (process.env.RESEND_API_KEY) {
      callback(null, true);
      console.log("✅ Resend email service ready");
    } else {
      callback(new Error("RESEND_API_KEY not found"), false);
      console.log("❌ Add RESEND_API_KEY to your environment");
    }
  }
};

export default transporter;
