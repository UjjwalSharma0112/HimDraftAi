import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import { generateDescription } from "../controller/ai";

const router = Router();

// Secure all AI generation routes with token verification
router.use(verifyToken);

// POST /api/ai/generate
router.post("/generate", generateDescription);

export default router;
