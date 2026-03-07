import * as userService from "../services/userService.js";
import { clearCookie } from "../utils/cookiesUtils.js";

export async function authContext(req, res, next) {
  req.user = null;
  res.locals.user = null;

  const userId = req.signedCookies.userId; //undefined, false, s%3A2.n%2FOmA0Ddcl3GNnfpEAtb%2F9Awl6fdIeo8tffBj2LabEc

  // caso 1 : Si la cookie es corrompida
  if (userId === false) {
    clearCookie(res, "userId");
    return next();
  }

  // Caso 2 : Si el userId No existe
  if (!userId) return next();

  // caso 3: Si el userId Existe, buscamos al usuario
  const user = await userService.getUserById(parseInt(userId));
  console.log(user);

  // Si el usuario no existe en mi base de datos, limpiamos la cookie
  if (!user) {
    clearCookie(res, "userId");
    return next();
  }

  req.user = user;
  res.locals.user = user;

  console.log(req.user, "aQUIII");

  next();
}
