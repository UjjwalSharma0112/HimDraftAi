import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "./auth/passport";
import authRouter from "./auth/auth.routes";
import productRouter from "./routes/description.routes";
import aiRouter from "./routes/ai.routes";
import { errorHandler } from "./middleware/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/descriptions", productRouter);
app.use("/api/ai", aiRouter);


app.use(errorHandler);

export default app;
