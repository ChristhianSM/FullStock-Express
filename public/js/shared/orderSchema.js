import { z } from "zod";

const valueEmpty = (name, type = "f") => {
  return `${type === "m" ? "El" : "La"} ${name} es requerid${type === "m" ? "o" : "a"}`; // El Nombre es requerido
};

export const orderSchema = z.object({
  email: z.email({ error: "Correo electrónico inválido" }),
  name: z.string().min(1, { error: valueEmpty("Nombre", "m") }),
  lastName: z.string().min(1, { error: valueEmpty("Apellido", "m") }),
  company: z.string().optional(),
  address: z.string().min(1, { error: valueEmpty("dirección") }),
  city: z.string().min(1, { error: valueEmpty("ciudad") }),
  country: z.string().min(1, { error: valueEmpty("pais", "m") }),
  region: z.string().min(1, { error: valueEmpty("región") }),
  code: z.string().min(1, { error: valueEmpty("codigo postal", "m") }),
  phone: z.string().min(1, { error: valueEmpty("telefono", "m") }),
});
