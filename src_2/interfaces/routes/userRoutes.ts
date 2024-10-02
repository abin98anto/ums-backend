import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { CreateUser } from "../../use-cases/CreateUser";
import { UpdateUser } from "../../use-cases/UpdateUser";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";

const userRepository = new UserRepositoryImpl();
const createUserUseCase = new CreateUser(userRepository);
const updateUserUseCase = new UpdateUser(userRepository);
const userController = new UserController(createUserUseCase, updateUserUseCase);

const router = Router();

router.post("/users", (req, res) => userController.createUser(req, res));
router.put("/users/:id", (req, res) => userController.updateUser(req, res));

export default router;
