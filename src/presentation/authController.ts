import { Request, Response } from "express";
import { register, login } from "../application/authService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, profileImage } = req.body;
    const token = await register(email, password, profileImage);
    res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unknown error occurred" });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.json({ token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "Unknown error occurred" });
    }
  }
};
