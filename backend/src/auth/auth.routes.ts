import { Router } from "express";
import passport from "./passport";
import { login, register } from "./auth.controller";
import { loginSchema, registerSchema, validateRequest } from "./auth.validation";
import { authRateLimiter } from "../middleware/rateLimiter";
import { generateToken } from "./auth.service";
import { IUser } from "../models/User";

const router = Router();

router.post("/register", authRateLimiter, validateRequest(registerSchema), register);
router.post("/login", authRateLimiter, validateRequest(loginSchema), login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login?error=oauth_failed" }),
  (req, res) => {
    if (!req.user) {
      res.redirect("http://localhost:5173/login?error=no_user");
      return;
    }
    const token = generateToken(req.user);
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

export default router;
