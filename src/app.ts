import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/database";
import taskRoutes from "./routes/task.routes";
import authRoutes from "./routes/auth.routes";
import { specs } from "./config/swagger";
import logger from "./utils/logger";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.use("/api/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error("Error:", err);
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  await connectDB();
  logger.info(`Server running on port ${PORT}`);
});

export default app;
