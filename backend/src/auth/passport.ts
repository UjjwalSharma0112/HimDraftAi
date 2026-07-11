import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateGoogleUser } from "./auth.service";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "dummy-client-id";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret";
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/api/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
        const name = profile.displayName || "";

        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        const user = await findOrCreateGoogleUser({
          id: profile.id,
          name,
          email,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id || user._id);
});

passport.deserializeUser((id: any, done) => {
  done(null, { id } as any);
});

export default passport;
