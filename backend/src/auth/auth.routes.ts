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
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err: any, user: any, info: any) => {
      if (err) {
        console.error("Google OAuth Callback Error:", err);
        res.redirect(`http://localhost:5173/login?error=oauth_failed&details=${encodeURIComponent(err.message || "Unknown error")}`);
        return;
      }
      if (!user) {
        console.error("Google OAuth Failed: No User Profile. Info:", info);
        res.redirect(`http://localhost:5173/login?error=no_user&details=${encodeURIComponent(info?.message || "User profile authentication failed")}`);
        return;
      }
      const token = generateToken(user);
      res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
    })(req, res, next);
  }
);

export default router;
