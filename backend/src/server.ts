import dotenv from "dotenv";
import app from "./app";

dotenv.config();
import { connectDB } from "./config/db";
const PORT = process.env.PORT || 8080;

const main = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
main();
