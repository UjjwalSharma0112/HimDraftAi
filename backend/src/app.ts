import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
console.log("Hllo");
app.get("/", (_req, res) => {
  console.log("asdas");
  res.json({
    message: "Backend running",
  });
});

export default app;
