import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./infrastructure/database";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "./presentation/authController";
import { getUsers, deleteUser } from "./presentation/userController";
import { protect } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB();

// User Side Routes
app.post("/register", registerUser);
app.post("/login", loginUser);
app.post("/refresh-accestoken", refreshAccessToken);
app.post("/logout", logoutUser);

// Admin Side Routes
app.post("/admin", )

app.get("/users", protect, getUsers);
app.delete("/users/:id", protect, deleteUser);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
