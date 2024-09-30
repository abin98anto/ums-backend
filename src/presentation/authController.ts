import { Request, Response } from "express";
import { register, login } from "../application/authService";
import jwt from "jsonwebtoken";

// Calls register(name, email, password, profileImage) and saves refreshToken in the server's cookie, returns acces token.
export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log('controller : ',req);
    const { name, email, password, profileImage } = req.body;

    const { accessToken, refreshToken } = await register(
      name,
      email,
      password,
      profileImage
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unknown error occurred" });
    }
  }
};

// Calls login(email, password) and saves refreshToken in the server's cookie, returns acces token.
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await login(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unknown error occurred" });
    }
  }
};

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

// User Logout Functionality (It just destroys the cookie).
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unkown error occured" });
    }
  }
};
