import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { IUser } from "../../domain/entities/userModel";

dotenv.config();

// Create access token.
export const generateAcessToken = (user: IUser) => {
  if (process.env.JWT_ACCESS)
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS, {
      expiresIn: "15m",
    });
};
