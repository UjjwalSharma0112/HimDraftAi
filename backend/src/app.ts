import express from "express";
import cors from "cors";
import productRouter from "./routes/description";
import { errorHandler } from "./middleware/errorMiddleware";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/descriptions", productRouter);
app.use(errorHandler);
export default app;
