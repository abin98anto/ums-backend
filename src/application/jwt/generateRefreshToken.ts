import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { IUser } from "../../domain/entities/userModel";

dotenv.config();

// Create Refresh token.
export const generateRefreshToken = (user: IUser) => {
  if (process.env.JWT_REFRESH)
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH,
      {
        expiresIn: "7d",
      }
    );
};