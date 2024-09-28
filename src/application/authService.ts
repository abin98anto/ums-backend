import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../domain/User";
import { IUser } from "../domain/entities/userModel";
import { generateAcessToken } from "./jwt/generateAccessToken";

dotenv.config();

// Create Refresh token.
const generateRefreshToken = (user: IUser) => {
  if (process.env.JWT_REFRESH)
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH,
      {
        expiresIn: "7d",
      }
    );
};

// Save the user in database, returns accessToken and refreshToken.
export const register = async (
  name: string,
  email: string,
  password: string,
  profileImage: string
) => {
  const user = new User({ name, email, password, profileImage });
  await user.save();

  const accessToken = generateAcessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};

// Checks user credentials, returns accessToken and refreshToken.
export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAcessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};
