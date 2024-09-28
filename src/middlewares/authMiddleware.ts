import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface UserJWT {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomRequest extends Request {
  user?: UserJWT;
}

// Middleware to protect admin routes.
export const protect = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    if (!process.env.JWT_ACCESS) {
      throw new Error("JWT_SECRET_KEY is not defined");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS
    ) as jwt.JwtPayload & UserJWT;

    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      createdAt: new Date(decoded.createdAt),
      updatedAt: new Date(decoded.updatedAt),
      profileImage: decoded.profileImage || undefined,
    };

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};
