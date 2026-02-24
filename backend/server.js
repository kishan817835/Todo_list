import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import mailRoutes from "./routes/mail.routes.js";
import { OTPMail,verifyEmailOTp } from "./controller/mail.controller.js";
import { remainderSendOnEmail } from "./controller/mail.controller.js";
import { OTP } from "./models/otp.model.js";
import { auth } from "./middleware/auth.js";
import cron from "node-cron";



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

// Manual OTP cleanup endpoint
app.delete("/api/cleanup-otp", async (req, res) => {
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const result = await OTP.deleteMany({ 
      expire: { $lt: tenMinutesAgo }
    });
    
    console.log(`🗑️ Manual cleanup: Deleted ${result.deletedCount} expired OTPs (older than 10 minutes)`);
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} expired OTPs (older than 10 minutes)`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('❌ Error in manual OTP cleanup:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

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


cron.schedule('* * * * *', async () => {
  console.log('⏰ Running scheduled email reminder check...');
  try {
    await remainderSendOnEmail();
  } catch (error) {
    console.error('❌ Error in scheduled email reminder:', error);
  }
});

cron.schedule('* * * * *', async () => {
  console.log('🧹 Running OTP cleanup check...');
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const result = await OTP.deleteMany({ 
      expire: { $lt: tenMinutesAgo }
    });
    
    if (result.deletedCount > 0) {
      console.log(`🗑️ Deleted ${result.deletedCount} expired OTPs (older than 10 minutes)`);
    }
  } catch (error) {
    console.error('❌ Error in OTP cleanup:', error);
  }
});

console.log('📧 Email reminder scheduler started (runs every 1 minute)');
console.log('🧹 OTP cleanup scheduler started (runs every 1 minute)');
