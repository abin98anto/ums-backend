import { Request, Response } from "express";

import User from "../domain/User";
import { adminLogin } from "../application/authService";
import { IUser } from "../domain/entities/userModel";

interface CustomRequest extends Request {
  user: IUser;
}

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await adminLogin(email, password);

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

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "user" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting user" });
  }
};

export const userExists = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.find({ email: req.user.email });
    user ? res.json(user) : res.json({});
  } catch (error) {
    res.status(400).json({ message: "Error checking if email is taken." });
  }
};
