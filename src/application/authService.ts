import jwt from "jsonwebtoken";
import { IUser } from "../domain/User";
import User from "../domain/User";
import dotenv from "dotenv";

dotenv.config();

// Create access token.
const generateAcessToken = (user: IUser) => {
  if (process.env.JWT_ACCESS)
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS, {
      expiresIn: "15m",
    });
};

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
  email: string,
  password: string,
  profileImage: string
) => {
  const user = new User({ email, password, profileImage });
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
