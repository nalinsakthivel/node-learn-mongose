import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { connectUsersDB } from "../utils/db";

interface Request extends ExpressRequest {
  user?: jwt.JwtPayload | string | object;
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send("Username and password venum da!");
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const date = new Date();
    const db = await connectUsersDB();
    await db
      .collection("users")
      .insertOne({ userid: userId, username, password: hashedPassword, date });
    res.status(201).send("User created da!");
  } catch (err) {
    res.status(500).send("DB error da!");
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const db = await connectUsersDB();
    const user = await db.collection("users").findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ username, userid: user.userid }, "secret-key", {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).send("Wrong credentials da!");
    }
  } catch (err) {
    res.status(500).send("DB error da!");
  }
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).send("Login pannu da!");
      return;
    }
    const decoded = jwt.verify(token, "secret-key") as jwt.JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send("Invalid token da!");
  }
};
