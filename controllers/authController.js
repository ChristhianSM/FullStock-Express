import * as authService from "../services/authService.js";

export async function renderSignup(req, res) {
  res.render("signup");
}

export async function handleSignup(req, res) {
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
