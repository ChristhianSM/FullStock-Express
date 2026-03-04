import * as authService from "../services/authService.js";
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
    await authService.signup(email, password, confirmPassword);

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
  if (req.user) {
    return res.redirect("/");
  }

  const { email, password } = req.body;

  try {
    const user = await authService.login(email, password);

    setCookie(res, "userId", user.id);

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
