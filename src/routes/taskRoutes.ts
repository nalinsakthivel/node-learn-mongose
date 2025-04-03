import express from "express";
import { auth } from "../controllers/authControllers";
import { addTask, getTasks } from "../controllers/taskControllers";

const taskRouter = express.Router();

taskRouter.get("/tasks", auth, getTasks);
taskRouter.post("/tasks", auth, addTask);

export default taskRouter;
