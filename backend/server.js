import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import mailRoutes from "./routes/mail.routes.js";
import { OTPMail,verifyEmailOTp } from "./controller/mail.controller.js";
import { remainderSendOnEmail } from "./controller/mail.controller.js";
import { auth } from "./middleware/auth.js";
import cron from "node-cron";

// import the function

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    
    'https://todo-list-steel-phi.vercel.app',
    'http://localhost:4200',
  ],
  credentials: true
}));


app.use(express.json());

app.post("/api/otp", OTPMail);
app.post("/api/otppasswordchange",verifyEmailOTp)
app.post("/api/remainder", remainderSendOnEmail);

app.use("/api", userRoutes);
app.use("/api", taskRoutes);
app.use("/api", mailRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Schedule email reminder to run every 1 minute
cron.schedule('* * * * *', async () => {
  console.log('⏰ Running scheduled email reminder check...');
  try {
    await remainderSendOnEmail();
  } catch (error) {
    console.error('❌ Error in scheduled email reminder:', error);
  }
});

console.log('📧 Email reminder scheduler started (runs every 1 minute)');
