export interface IUser extends Document {
  _id?: string;
  email: string;
  name: string;
  password: string;
  role: string;
  profileImage: string;
  comparePassword: (password: string) => Promise<Boolean>;
}
