import express from "express";

import { auth } from "../controllers/authControllers";
import {
  addTask,
  deleteTaskById,
  getTaskById,
  getTasks,
} from "../controllers/taskControllers";

const taskRouter = express.Router();

taskRouter.get("/tasks", auth, getTasks);
taskRouter.get("/tasks/:id", auth, getTaskById);
taskRouter.post("/tasks", auth, addTask);
taskRouter.delete("/tasks/:id", auth, deleteTaskById);

export default taskRouter;
