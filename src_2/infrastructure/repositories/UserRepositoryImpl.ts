import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";
import UserModel from "../db/UserModel";

export class UserRepositoryImpl implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;
    return new User(user.id, user.name, user.email, user.password);
  }

  async create(user: User): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return new User(newUser.id, newUser.name, newUser.email, newUser.password);
  }

  async update(user: User): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(user.id, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User not found");
    return new User(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email,
      updatedUser.password
    );
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
