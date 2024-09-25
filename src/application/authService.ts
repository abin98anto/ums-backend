import jwt from "jsonwebtoken";
import { IUser } from "../domain/User";
import User from "../domain/User";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: "1h" }
  );
};

export const register = async (
  email: string,
  password: string,
  profileImage: string
) => {
  const user = new User({ email, password, profileImage });
  await user.save();
  return generateToken(user);
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }
  return generateToken(user);
};
