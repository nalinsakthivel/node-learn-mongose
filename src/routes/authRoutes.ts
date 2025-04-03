import express from "express";
import { login, signup } from "../controllers/authControllers";

const authRouter = express.Router();

authRouter.get("/signup", signup);
authRouter.post("/login", login);

export default authRouter;
