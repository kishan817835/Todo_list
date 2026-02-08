import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import mailRoutes from "./routes/mail.routes.js";
// import the function

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://9frp2hq4-4200.inc1.devtunnels.ms'
  ],
  credentials: true
}));


app.use(express.json());

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
