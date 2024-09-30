import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Takes the refresh token from the server and returns a new accessToken.
export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found." });
    }

    if (!process.env.JWT_REFRESH || !process.env.JWT_ACCESS) {
      return res.status(401).json({
        message:
          "Refresh token secret key or Access token secret key not found",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH);
    const newAccessToken = jwt.sign(
      { id: (decoded as any).id, role: (decoded as any).role },
      process.env.JWT_ACCESS,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unkown error occured" });
    }
  }
};
