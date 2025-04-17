import express from "express";

import {
  getTasks,
  getTaskById,
  addTask,
  deleteTaskById,
} from "@controllers/taskControllers";
import { auth } from "@middlewares/authMiddleware";

const taskRouter = express.Router();

taskRouter.get("/tasks", auth, getTasks);
taskRouter.get("/tasks/:id", auth, getTaskById);
taskRouter.post("/tasks", auth, addTask);
taskRouter.delete("/tasks/:id", auth, deleteTaskById);

export default taskRouter;
