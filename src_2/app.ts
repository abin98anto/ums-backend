import express from "express";
import userRoutes from "./interfaces/routes/userRoutes";
import { connectToMongoDB } from "./infrastructure/db/mongoConnection";

const app = express();

app.use(express.json());
app.use("/", userRoutes);

connectToMongoDB();

export default app;
