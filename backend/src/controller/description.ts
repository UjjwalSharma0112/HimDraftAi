import { Request, Response, NextFunction } from "express";
import * as descriptionService from "../services/description";

export const getAllDescriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const descriptions = await descriptionService.getAllDescriptions(req.user!.id);
    res.status(200).json(descriptions);
  } catch (error) {
    next(error);
  }
};

export const getDescriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const description = await descriptionService.getDescriptionById(id, req.user!.id);
    if (!description) {
      res.status(404).json({
        message: "Description not found",
      });
      return;
    }
    res.status(200).json(description);
  } catch (error) {
    next(error);
  }
};

export const createDescriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newDescription = await descriptionService.createDescription(req.user!.id, req.body);
    res.status(201).json(newDescription);
  } catch (error) {
    next(error);
  }
};

export const editDescriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const updatedDescription = await descriptionService.updateDescription(id, req.user!.id, req.body);
    if (!updatedDescription) {
      res.status(404).json({
        message: "Description not found",
      });
      return;
    }
    res.status(200).json(updatedDescription);
  } catch (error) {
    next(error);
  }
};

export const deleteDescriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const deletedDescription = await descriptionService.deleteDescription(id, req.user!.id);
    if (!deletedDescription) {
      res.status(404).json({
        message: "Description not found",
      });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const searchDescription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = String(req.query.q || "");
    const filtered = await descriptionService.searchDescriptions(query, req.user!.id);
    res.status(200).json(filtered);
  } catch (error) {
    next(error);
  }
};
