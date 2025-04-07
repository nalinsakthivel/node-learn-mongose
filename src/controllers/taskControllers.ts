import { Request, Response } from "express";

import { connectTaskDB } from "../config/dbConfig";
import { Task } from "../model/taskModel";
import logger from "../utils/logger";
import { base64ToLink, writePhotoFile } from "../utils/fileIOHelper";
import { StatusType } from "../enum/StatusType";

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectTaskDB();
    const userId = (req as any).user.userid;
    const tasks = await db
      .collection("tasks")
      .find({ userId, status: StatusType.Active })
      .toArray();

    const task = tasks.map((task) => {
      return {
        id: task.id,
        title: task.title,
        image: task.image,
      };
    });

    res.status(200).json(task);
    logger.info("Get tasks da!", task);
  } catch (err) {
    res.status(500).send("DB error da!");
    logger.error("Get tasks DB error da!", err);
  }
};

// Get task by ID
export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskId = req.params.id;
    const db = await connectTaskDB();
    const userId = (req as any).user.userid;
    const task = await db
      .collection("tasks")
      .findOne({ id: parseInt(taskId), userId, status: StatusType.Active });
    if (!task) {
      res.status(404).send("Task not found da!");
      logger.error("Task not found da!", { taskId });
      return;
    }
    const taskData = {
      id: task.id,
      title: task.title,
      image: task.image,
    };
    res.status(200).json(taskData);
    logger.info("Get task by ID da!", taskData);
  } catch (err) {
    res.status(500).send("DB error da!");
    logger.error("Get task by ID DB error da!", err);
  }
};

// Add a new task
export const addTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, image } = req.body;
    const userId = (req as any).user.userid;

    if (!title) {
      res.status(400).send("Title venum da!");
      logger.error("Title is missing da!");
      return;
    }

    if (!image) {
      res.status(400).send("Image venum da!");
      logger.error("Image is missing da!");
      return;
    }

    const db = await connectTaskDB();
    const link = await base64ToLink(image, Date.now());
    const newTask: Task = {
      id: Date.now(),
      title,
      image: link,
      userId,
      status: StatusType.Active,
    };
    await db.collection("tasks").insertOne(newTask);
    res.status(201).json(newTask);
    logger.info("Task added da!", newTask);
  } catch (err) {
    res.status(500).send("DB error da!");
    logger.error("Add task DB error da!", err);
  }
};

//delete a task
export const deleteTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskId = req.params.id;
    const db = await connectTaskDB();
    const userId = (req as any).user.userid;
    const task = await db
      .collection("tasks")
      .findOne({ id: parseInt(taskId), userId, status: StatusType.Active });
    if (!task) {
      res.status(404).send("Task not found da!");
      logger.error("Task not found da!", { taskId });
      return;
    }
    const result = await db
      .collection("tasks")
      .updateOne(
        { id: parseInt(taskId), userId, status: StatusType.Active },
        { $set: { status: StatusType.Inactive } }
      );
    if (result.modifiedCount === 0) {
      res.status(500).send("Task deletion failed da!");
      logger.error("Task deletion failed da!", { taskId });
      return;
    }

    res.status(200).send("Task deleted da!");
    logger.info("Task deleted da!", { taskId });
  } catch (err) {
    res.status(500).send("DB error da!");
    logger.error("Delete task DB error da!", err);
  }
};
