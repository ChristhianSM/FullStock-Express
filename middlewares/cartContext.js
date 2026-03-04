export async function cartContext(req, _res, next) {
  const cartIdCookie = req.signedCookies.cartId;

  req.cartId = cartIdCookie ? Number(cartIdCookie) : null;

  next();
}
