import { getUserById } from "../services/userService.js";
import { clearCookie } from "../utils/cookiesUtils.js";

export async function authContext(req, res, next) {
  req.user = null;
  res.locals.user = null;

  const userId = parseInt(req.cookies.userId);
  if (!userId) {
    return next();
  }

  const user = await getUserById(userId);

  if (!user) {
    clearCookie("userId");
    return next();
  }

  req.user = user;
  res.locals.user = user;

  next();
}
