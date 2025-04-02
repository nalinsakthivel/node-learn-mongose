import express, { Request, Response } from "express";
import { addTask, getTasks } from "./routes/taskRoutes";
import dotenv from "dotenv";
import { auth, login, signup } from "./routes/authRoutes";
import logger from "./utils/logger";
import path from "path";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.post("/signup", signup);
app.post("/login", login);
app.get("/tasks", auth, getTasks);
app.post("/tasks", auth, addTask);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req: Request, res: Response) => {
  res.send(`Welcome!`);
  logger.info("Welcome message sent da!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port} da!`);
});
