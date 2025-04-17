import { Request, Response } from "express";

import { StatusType } from "@enums/StatusType";
import { TaskModel } from "@models/taskModel";
import { base64ToLink } from "@utils/fileIOHelper";
import { logger } from "@utils/logger";

// Get all tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    /*
    #swagger.tags = ['Task CRUD']
    #swagger.summary = 'Get all tasks'
    #swagger.description = 'Get all tasks'
    #swagger.responses[201] = {
      description: 'Tasks retrieved successfully',
      schema: {
          type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                title: { type: 'string', example: 'Task Title' },
                image: { type: 'string', example: 'http://localhost:3000/uploads/photo.jpg' }
              }
            }
      }
    }
    #swagger.responses[400] = {
      description: 'Tasks not found',
      schema: {
        message: 'Tasks not found'
      }
    }
    #swagger.responses[500] = {
      description: 'DB error',
      schema: {
        message: 'DB error',
        error: 'Some DB error details'
      }
    }
  */
    const userId = (req as any).user.userid;
    const tasks = await TaskModel.find({ userId, status: StatusType.Active });

    const task = tasks
      .map((task) => {
        return {
          id: task.id,
          title: task.title,
          image: task.image,
        };
      })
      .sort((a, b) => a.id - b.id);

    res.status(200).json(task);
    logger.info("Get tasks", task);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err });
    logger.error("Get tasks DB error", err);
  }
};

// Get task by ID
export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /*
    #swagger.tags = ['Task CRUD']
    #swagger.summary = 'Get task by ID'
    #swagger.description = 'Get task by ID'
    #swagger.parameters['id'] = {
      description: 'Task ID',
      required: true,
      type: 'integer'
    }
    #swagger.responses[201] = {
      description: 'Task retrieved successfully',
      schema: {
      id: 1,
      title: 'Task Title',
      image: 'http://localhost:3000/uploads/photo-1678901234567.jpg'
      }
    }
    #swagger.responses[400] = {
      description: 'Task not found',
      schema: {
        message: 'Task not found'
      }
    }
    #swagger.responses[500] = {
      description: 'DB error',
      schema: {
        message: 'DB error',
        error: 'Some DB error details'
      }
    }
  */
    const taskId = req.params.id;
    const userId = (req as any).user.userid;
    const task = await TaskModel.findOne({
      id: parseInt(taskId),
      userId,
      status: StatusType.Active,
    });
    if (!task) {
      res.status(400).json({ message: "Task not found" });
      logger.error("Task not found", { taskId });
      return;
    }
    const taskData = {
      id: task.id,
      title: task.title,
      image: task.image,
    };
    res.status(200).json(taskData);
    logger.info("Get task by ID", taskData);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err });
    logger.error("Get task by ID DB error", err);
  }
};

// Add a new task
export const addTask = async (req: Request, res: Response): Promise<void> => {
  try {
    /*
    #swagger.tags = ['Task CRUD']
    #swagger.summary = 'Add a new task'
    #swagger.description = 'Add a new task'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        title: 'Task Title',
        image: 'base64ImageString'
      }
    }
    #swagger.responses[201] = {
      description: 'Task created successfully',
      schema: {
       message: 'Task created successfully'
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid username or password',
      schema: {
        message: 'Invalid username or password'
      }
    }
    #swagger.responses[500] = {
      description: 'DB error',
      schema: {
        message: 'DB error',
        error: 'Some DB error details'
      }
    }
  */
    const { title, image } = req.body;
    const userId = (req as any).user.userid;

    if (!title) {
      res.status(400).json({ message: "Title is missing" });
      logger.error("Title is missing");
      return;
    }

    if (!image) {
      res.status(400).json({ message: "Image is missing" });
      logger.error("Image is missing");
      return;
    }

    const link = await base64ToLink(image, Date.now());

    if (!link) {
      res.status(400).json({ message: "Image conversion failed" });
      logger.error("Image conversion failed");
      return;
    }

    const newTask = new TaskModel({
      id: Date.now(),
      title,
      image: link,
      userId,
      status: StatusType.Active,
    });

    const existingTask = await TaskModel.findOne({
      title,
      userId,
      status: StatusType.Active,
    });
    if (existingTask) {
      res.status(400).json({ message: "Task already exists" });
      logger.error("Task already exists", { title });
      return;
    }

    const isInserted = await newTask.save();

    if (!isInserted) {
      res.status(400).json({ message: "Task not created" });
      logger.error("Task not created", { title });
      return;
    }

    res.status(201).json({
      message: "Task created successfully",
    });
    logger.info("Task added", newTask);
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err });
    logger.error("Add task DB error", err);
  }
};

//delete a task
export const deleteTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /*
    #swagger.tags = ['Task CRUD']
    #swagger.summary = 'Delete task by ID'
    #swagger.description = 'Delete task by ID'
    #swagger.parameters['id'] = {
      description: 'Task ID',
      required: true,
      type: 'integer'
    }
    #swagger.responses[201] = {
      description: 'Task deleted successfully',
      schema: {
        message: 'Task deleted successfully'
      }
    }
    #swagger.responses[400] = {
      description: 'Task not found',
      schema: {
        message: 'Task not found'
      }
    }
    #swagger.responses[500] = {
      description: 'DB error',
      schema: {
        message: 'DB error',
        error: 'Some DB error details'
      }
    }
  */
    const taskId = req.params.id;
    const userId = (req as any).user.userid;
    const task = await TaskModel.findOne({
      id: parseInt(taskId),
      userId,
      status: StatusType.Active,
    });
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      logger.error("Task not found", { taskId });
      return;
    }
    const result = await TaskModel.updateOne(
      { id: parseInt(taskId), userId, status: StatusType.Active },
      { $set: { status: StatusType.Inactive } }
    );
    if (result.modifiedCount === 0) {
      res.status(500).json({ message: "Task deletion failed" });
      logger.error("Task deletion failed", { taskId });
      return;
    }

    res.status(200).json({ message: "Task deleted successfully" });
    logger.info("Task deleted", { taskId });
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err });
    logger.error("Delete task DB error", err);
  }
};
