import User from "../domain/User";
import { generateAcessToken } from "./jwt/generateAccessToken";
import { generateRefreshToken } from "./jwt/generateRefreshToken";

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

  return { accessToken, refreshToken, user };
};

// Checks user credentials, returns accessToken and refreshToken.
export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAcessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken, user };
};

export const adminLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (
    !user ||
    user.role !== "admin" ||
    !(await user.comparePassword(password))
  ) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateAcessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken, user };
};
