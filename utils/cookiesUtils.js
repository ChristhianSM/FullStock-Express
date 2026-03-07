const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export function setCookie(res, nameCookie, valueCookie, options = {}) {
  const DEFAULT_OPTIONS = {
    httpOnly: true,
    maxAge: MAX_AGE,
    sameSite: "lax",
    // secure: process.env.NODE_ENV === "production",
  };

  res.cookie(nameCookie, valueCookie, {
    ...DEFAULT_OPTIONS,
    ...options,
  });

  // res.cookie("userId", 1, {
  //   httpOnly: true,
  //   maxAge: MAX_AGE,
  //   sameSite: "lax",
  //   signed: true,
  // });
}

export function clearCookie(res, nameCookie) {
  res.clearCookie(nameCookie);
}
