import { Request, Response } from "express";
import fs from "fs/promises";

import { connectTaskDB } from "../utils/db";
import { Task } from "../utils/storage";

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await connectTaskDB();
    const tasks = await db.collection("tasks").find().toArray();
    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    res.status(500).send("DB error da!");
  }
};

// Add a new task
export const addTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).send("Title venum da!");
      return;
    }
    const db = await connectTaskDB();
    const newTask: Task = {
      id: Date.now(),
      title,
      done: false,
    };
    const result = await db.collection("tasks").insertOne(newTask);
    res.status(201).json({ ...newTask, _id: result.insertedId });
  } catch (err) {
    res.status(500).send("DB error da!");
  }
};

export const uploadPhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { photo } = req.body;
  if (!photo) {
    res.status(400).send("Base64 image venum da!");
    return;
  }

  try {
    const buffer = Buffer.from(photo, "base64");
    const filename = `uploads/photo-${Date.now()}.jpg`;
    await fs.writeFile(filename, buffer);
    res.send(`File uploaded da: ${filename}`);
  } catch (error) {
    res.status(500).send("Invalid base64 data da!");
  }
};
