import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  createDescriptionById,
  deleteDescriptionById,
  editDescriptionById,
  getAllDescriptions,
  getDescriptionById,
  searchDescription,
} from "../controller/description";

const router = Router();

// All description routes require authentication
router.use(verifyToken);

router.get("/", getAllDescriptions);
router.get("/search", searchDescription);
router.get("/:id", getDescriptionById);
router.post("/", createDescriptionById);
router.put("/:id", editDescriptionById);
router.delete("/:id", deleteDescriptionById);

export default router;
