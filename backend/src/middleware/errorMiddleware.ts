import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      description:
        "An unexpected error occurred while processing your request. Please try again later.",
    },
  });
};
