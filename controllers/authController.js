import * as authService from "../services/authService.js";
import * as cartService from "../services/cartService.js";
import * as orderService from "../services/orderService.js";
import { clearCookie, setCookie } from "../utils/cookiesUtils.js";

export async function renderSignup(req, res) {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("signup");
}

export async function handleSignup(req, res) {
  if (req.user) {
    return res.redirect("/");
  }
  const { email: emailBody, password, confirmPassword } = req.body;

  const email = emailBody.toLowerCase();

  try {
    const newUser = await authService.signup(email, password, confirmPassword);

    setCookie(res, "userId", newUser.id, { signed: true });

    // Vinculamos las ordenes pasadas que usuaron este email
    await orderService.linkPastOrderByEmail(newUser.email, newUser.id);

    // fusionamos el carrito de invitado con el carrito del usuario recien creado
    if (req.cartId) {
      await cartService.mergeCarts(req.cartId, newUser.id);
    }

    res.redirect("/");
  } catch (error) {
    res.render("signup", {
      error: error.message,
      values: { email },
    });
  }
}

export async function renderLogin(req, res) {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("login");
}

export async function handleLogin(req, res) {
  console.log(req.user, "Aquii");
  if (req.user) {
    return res.redirect("/");
  }

  const { email, password } = req.body;

  try {
    const user = await authService.login(email, password);

    setCookie(res, "userId", user.id, { signed: true });

    // fusionamos el carrito de invitado con el carrito del usuario logueado
    if (req.cartId) {
      await cartService.mergeCarts(req.cartId, user.id);
    }

    res.redirect("/");
  } catch (error) {
    res.render("login", {
      error: error.message,
      values: { email },
    });
  }
}

export async function handleLogout(_req, res) {
  clearCookie(res, "userId");

  res.redirect("/");
}
