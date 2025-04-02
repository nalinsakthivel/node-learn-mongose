import { Request, Response } from "express";

import { connectTaskDB } from "../config/dbConfig";
import { Task } from "../model/taskModel";
import logger from "../utils/logger";
import { base64ToLink, writePhotoFile } from "../utils/fileIOHelper";

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectTaskDB();
    const tasks = await db.collection<Task[]>("tasks").find().toArray();
    res.status(200).json(tasks);
    logger.info("Get tasks da!", tasks);
  } catch (err) {
    res.status(500).send("DB error da!");
    logger.error("Get tasks DB error da!", err);
  }
};

// Add a new task
export const addTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, image } = req.body;
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
      done: false,
    };
    await db.collection("tasks").insertOne(newTask);
    res.status(201).json(newTask);
    logger.info("Task added da!", newTask);
  } catch (err) {
    res.status(500).send("DB error da!");
    logger.error("Add task DB error da!", err);
  }
};
