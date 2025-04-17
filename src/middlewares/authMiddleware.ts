import { Request as ExpressRequest, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { logger } from "@utils/logger";
import { UserModel } from "@models/usermodel";

interface Request extends ExpressRequest<{}, {}, UserModel> {
  user?: jwt.JwtPayload | string | object;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.error("Token is missing");
      res.status(401).json({ message: "Need to login" });
      return;
    }

    const secretKey = process.env.JWT_SECRET || "default-secret";
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;

    req.user = decoded;
    logger.info("Token verified da!", decoded);

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      logger.error("Token expired", { error: err.message });
      res.status(401).json({ message: "Token expired" });
      return;
    }

    logger.error("Token verification failed", { error: err });
    res.status(403).json({ message: "Invalid token" });
    return;
  }
};
