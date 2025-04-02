import express, { Request, Response } from "express";
import { addTask, getTasks } from "./routes/taskRoutes";
import dotenv from "dotenv";
import { auth, login, signup } from "./routes/authRoutes";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.post("/signup", signup);
app.post("/login", login);
app.get("/tasks", auth, getTasks);
app.post("/tasks", auth, addTask);

app.get("/", auth, (req: Request, res: Response) => {
  res.send(`Welcome!`);
});

app.listen(port, () => console.log("Server 3000-la run aagudhu!"));
