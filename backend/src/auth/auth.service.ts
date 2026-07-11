import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_me_in_prod";
const SALT_ROUNDS = 10;

export const generateToken = (user: { id?: any; _id?: any; email: string; name?: string; provider?: string }): string => {
  const userId = user.id || user._id;
  return jwt.sign(
    {
      id: userId.toString(),
      email: user.email,
      name: user.name || "",
      provider: user.provider || "local",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    provider: "local",
  });

  return {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    provider: newUser.provider,
  };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.provider !== "local" || !user.passwordHash) {
    throw new Error("This account uses Google login. Please login with Google.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      provider: user.provider,
    },
  };
};

export const findOrCreateGoogleUser = async (profile: {
  id: string;
  name: string;
  email: string;
}) => {
  let user = await User.findOne({ email: profile.email.toLowerCase() });

  if (user) {
    if (!user.googleId) {
      user.googleId = profile.id;
      user.provider = "google";
      await user.save();
    }
  } else {
    user = await User.create({
      name: profile.name,
      email: profile.email.toLowerCase(),
      provider: "google",
      googleId: profile.id,
    });
  }

  return user;
};
