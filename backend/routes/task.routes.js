import express from "express";
import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
  reorderTasks,
  getTaskDaysCount,
  getRecentTasks,
  publicTask,
  getPublicTaskById,
  getTaskById
} from "../controller/task.controller.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// Public routes - no authentication required
router.get("/task/public/:id", getPublicTaskById);

// Protected routes - authentication required
router.use(auth);

router.post("/createtask", createTask);

router.get("/gettasks", getMyTasks);
router.get("/gettasks/recent", getRecentTasks);
router.post("/task/visibility", publicTask);

// Authenticated task detail route - can access own private tasks or any public task
router.get("/task/:id", getTaskById);

router.put("/updatetask/:id", updateTask);

router.delete("/deletetask/:id", deleteTask);

router.put("/reorder/all", reorderTasks);

router.get("/taskdayscount/:id", getTaskDaysCount);

export default router;
