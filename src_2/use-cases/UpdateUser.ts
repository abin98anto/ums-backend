import { UserRepository } from "../domain/repositories/UserRepository";
import { User } from "../domain/entities/User";

export class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(
    id: string,
    name: string,
    email: string,
    password: string
  ): Promise<User | null> {
    const userToUpdate = await this.userRepository.findById(id);
    if (!userToUpdate) return null;

    userToUpdate.name = name;
    userToUpdate.email = email;
    userToUpdate.password = password;
    return await this.userRepository.update(userToUpdate);
  }
}
