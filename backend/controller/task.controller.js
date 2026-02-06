import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate,deadlineTime } = req.body;

    const lastTask = await Task
      .findOne({ createdBy: req.user.userId })
      .sort({ order: -1 });

    const nextOrder = lastTask ? lastTask.order + 1 : 1;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      deadlineTime,
      createdBy: req.user.userId,
      order: nextOrder
    });

    res.status(201).json({
      success: true,
      message: "Task created",
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;

    const filter = { createdBy: req.user.userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const getRecentTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user.userId
    })
      .sort({ createdAt: -1 })
      .limit(6);              

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.status === "completed") {
      updateData.completedAt = new Date();
    } else if (updateData.status) {
      updateData.completedAt = null;
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      updateData,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task updated",
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      createdBy: req.user.userId
    });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({
      success: true,
      message: "Task deleted"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderTasks = async (req, res) => {
  try {
    const updates = req.body;

    const bulkOps = updates.map(item => ({
      updateOne: {
        filter: { _id: item.id, createdBy: req.user.userId },
        update: { $set: { order: item.order } }
      }
    }));

    await Task.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: "Tasks reordered"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getTaskDaysCount = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      createdBy: req.user.userId
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const startDate = task.completedAt
      ? task.completedAt
      : task.createdAt;

    const diffTime = Date.now() - new Date(startDate).getTime();
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    res.json({
      success: true,
      taskId: task._id,
      status: task.status,
      days
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};