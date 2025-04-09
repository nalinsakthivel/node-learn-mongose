import express, { Request, Response } from "express";
import taskRouter from "./routes/taskRoutes";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";
import logger from "./utils/logger";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./utils/swagger-output.json";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(authRouter);
app.use(taskRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running on port ${port} da!`);
});
