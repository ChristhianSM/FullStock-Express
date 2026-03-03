import bcryptjs from "bcryptjs";
import { AppError } from "../utils/errorUtils.js";
import * as userService from "./userService.js";

export async function signup(email, password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new AppError("Las contraseñas no coinciden", 400);
  }

  const existUser = await userService.getUserByEmail(email);

  if (existUser) {
    throw new AppError("El correo ya ha sido registrado con anterioridad", 400);
  }

  const SALT_ROUNDS = 10;
  const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);

  const newUser = {
    email,
    password: hashedPassword,
  };

  return await userService.createUser(newUser);
}
