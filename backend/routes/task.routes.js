import express from "express";
import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
  reorderTasks,
  getTaskDaysCount
} from "../controller/task.controller.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();


router.use(auth);


router.post("/createtask", createTask);

router.get("/gettasks", getMyTasks);

router.put("/updatetask/:id", updateTask);

router.delete("/deletetask/:id", deleteTask);

router.put("/reorder/all", reorderTasks);

router.get("/taskdayscount/:id", getTaskDaysCount);

export default router;
