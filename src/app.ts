import express from "express";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json";
import authRouter from "@routes/authRoutes";
import taskRouter from "@routes/taskRoutes";
import { connectClient } from "@config/dbConfig";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.use(authRouter);
app.use(taskRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

(async () => {
  await connectClient();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
