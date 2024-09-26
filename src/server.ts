import express from "express";
import dotenv from "dotenv";
import connectDB from "./infrastructure/database";
import { registerUser, loginUser } from "./presentation/authController";
import { getUsers, deleteUser } from "./presentation/userController";
import { protect } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

connectDB();

app.post("/register", registerUser);
app.post("/login", loginUser);

app.get("/api/users", protect, getUsers);
app.delete("/api/users/:id", protect, deleteUser);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
