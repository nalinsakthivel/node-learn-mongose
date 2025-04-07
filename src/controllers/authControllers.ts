import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { connectUsersDB } from "../config/dbConfig";
import logger from "../utils/logger";
import { StatusType } from "../enum/StatusType";

interface Request extends ExpressRequest {
  user?: jwt.JwtPayload | string | object;
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password venum da!" });
      logger.error("Username or password is missing da!");
      return;
    }

    const db = await connectUsersDB();

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists da!" });
      logger.error("Username already exists da!", { username });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    const date = new Date();

    const result = await db.collection("users").insertOne({
      userid: userId,
      username,
      password: hashedPassword,
      date,
      status: StatusType.Active,
    });

    if (!result.acknowledged) {
      throw new Error("User creation failed in DB");
    }

    res.status(201).json({ message: "User created da!", userid: userId });
    logger.info("User created da!", { userid: userId, username, date });
  } catch (err) {
    res.status(500).json({ message: "DB error da!", error: err });
    logger.error("Signup DB error da!", err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Username and password venum da!" });
      logger.error("Username or password is missing da!");
      return;
    }

    const db = await connectUsersDB();
    const user = await db
      .collection("users")
      .findOne({ username, status: StatusType.Active });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Wrong credentials da!" });
      logger.error("Login failed da!", { username });
      return;
    }

    const token = jwt.sign(
      { username, userid: user.userid },
      process.env.JWT_SECRET || "default-secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful da!", token });
    logger.info("User logged in da!", { username, userid: user.userid });
  } catch (err) {
    res.status(500).json({ message: "DB error da!", error: err });
    logger.error("Login DB error da!", err);
  }
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.error("Token is missing da!");
      res.status(401).json({ message: "Login pannu da!" });
      return;
    }

    const secretKey = process.env.JWT_SECRET || "default-secret";
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;

    req.user = decoded;
    logger.info("Token verified da!", decoded);

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      logger.error("Token expired da!", { error: err.message });
      res.status(401).json({ message: "Token expired da!" });
      return;
    }

    logger.error("Token verification failed da!", { error: err });
    res.status(403).json({ message: "Invalid token da!" });
    return;
  }
};
