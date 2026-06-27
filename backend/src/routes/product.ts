import { Router } from "express";
import descriptions from "./inmemorydata";
const router = Router();

router.get("/", async (req, res) => {
  res.status(200).json(descriptions);
});

router.get("/search", async (req, res) => {
  const q = String(req.query.q || "").toLowerCase();

  const filtered = descriptions.filter((d) =>
    d.productName.toLowerCase().includes(q),
  );

  res.status(200).json(filtered);
});

router.get("/:id", async (req, res) => {
  const description = descriptions.find((d) => d.id === req.params.id);

  if (!description) {
    return res.status(404).json({
      message: "Description not found",
    });
  }

  res.status(200).json(description);
});
router.post("/", async (req, res) => {
  const newDescription = {
    id: Date.now().toString(),
    ...req.body,
  };

  descriptions.push(newDescription);

  res.status(201).json(newDescription);
});

router.put("/:id", async (req, res) => {
  const index = descriptions.findIndex((d) => d.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: "Description not found",
    });
  }

  descriptions[index] = {
    ...descriptions[index],
    ...req.body,
  };

  res.status(200).json(descriptions[index]);
});
router.delete("/:id", async (req, res) => {
  const index = descriptions.findIndex((d) => d.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: "Description not found",
    });
  }

  descriptions.splice(index, 1);

  res.status(204).send();
});

export default router;
