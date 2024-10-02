import { Request, Response } from "express";
import { CreateUser } from "./../../use-cases/CreateUser";
import { UpdateUser } from "./../../use-cases/UpdateUser";

export class UserController {
  constructor(
    private createUserUseCase: CreateUser,
    private updateUserUseCase: UpdateUser
  ) {}

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await this.createUserUseCase.execute(name, email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
      const updatedUser = await this.updateUserUseCase.execute(
        id,
        name,
        email,
        password
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
