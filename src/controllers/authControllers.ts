import { Request as ExpressRequest, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { UserModel } from "@models/usermodel";
import { logger } from "@utils/logger";
import { StatusType } from "@enums/StatusType";

interface Request extends ExpressRequest<{}, {}, UserModel> {
  user?: jwt.JwtPayload | string | object;
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    /*
    #swagger.tags = ['User CRUD']
    #swagger.summary = 'User signup'
    #swagger.description = 'Signup a user with valid credentials.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        username: 'testuser',
        password: 'password123'
      }
    }
    #swagger.responses[201] = {
      description: 'Signup successful',
      schema: {
        message: 'User created',
        userid: 'string'
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
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Invalid username or password" });
      logger.error("Invalid username or password");
      return;
    }

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" });
      logger.error("Username already exists", { username });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    const date = new Date();

    const user = new UserModel({
      userid: userId,
      username,
      password: hashedPassword,
      date,
      status: StatusType.Active,
    });

    const isInserted = await user.save();

    if (!isInserted) {
      res.status(400).json({ message: "User not created" });
      logger.error("User not created", { username });
      return;
    }

    res.status(201).json({ message: "User created", userid: userId });
    logger.info("User created", { userid: userId, username, date });
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err });
    logger.error("Signup DB error", err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  /*
    #swagger.tags = ['User CRUD']
    #swagger.summary = 'User login'
    #swagger.description = 'Login a user with valid credentials.'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        username: 'testuser',
        password: 'password123'
      }
    }
    #swagger.responses[201] = {
      description: 'Login successful',
      schema: {
        message: 'Login successful',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...'
      }
    }
    #swagger.responses[400] = {
      description: 'Invalid username or password',
      schema: {
        message: 'Invalid username or password'
      }
    }
    #swagger.responses[401] = {
      description: 'Wrong credentials',
      schema: {
        message: 'Wrong credentials'
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
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Invalid username or password" });
      logger.error("Invalid username or password");
      return;
    }

    const user = await UserModel.findOne({
      username,
      status: StatusType.Active,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Wrong credentials" });
      logger.error("Login failed", { username });
      return;
    }

    const token = jwt.sign(
      { username, userid: user.userid },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "Login successful", token });
    logger.info("User logged in", { username, userid: user.userid });
  } catch (err) {
    res.status(500).json({ message: "DB error", error: err });
    logger.error("Login DB error", err);
  }
};
