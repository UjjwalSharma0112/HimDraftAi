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

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(passport.initialize());

// Health check endpoint for deployment monitoring (Render/Vercel)
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/descriptions", productRouter);
app.use("/api/ai", aiRouter);


app.use(errorHandler);

export default app;
