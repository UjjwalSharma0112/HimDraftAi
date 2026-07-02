import { Router } from "express";
import {
  createDescriptionById,
  deleteDescriptionById,
  editDescriptionById,
  getAllDescriptions,
  getDescriptionById,
  searchDescription,
} from "../controller/description";
const router = Router();

router.get("/", getAllDescriptions);

router.get("/search", searchDescription);

router.get("/:id", getDescriptionById);
router.post("/", createDescriptionById);

router.put("/:id", editDescriptionById);
router.delete("/:id", deleteDescriptionById);

export default router;
