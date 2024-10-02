import { UserRepository } from "../domain/repositories/UserRepository";
import { User } from "../domain/entities/User";

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const newUser = new User("id", name, email, password);
    return await this.userRepository.create(newUser);
  }
}
