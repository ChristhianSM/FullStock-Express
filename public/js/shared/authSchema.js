import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Correo electronico invalido" }),
  password: z.string().min(1, { error: "La contraseña es requerida" }),
});

export const signupSchema = z
  .object({
    email: z.email({ error: "Correo electronico invalido" }),
    password: z
      .string()
      .min(6, { error: "La contraseña debe tener como minimo 6 carateres" }),
    confirmPassword: z.string().min(1, { error: "Confirme su contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
