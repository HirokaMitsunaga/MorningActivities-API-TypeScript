import { Context, Next } from "hono";
import { getCookie, getSignedCookie } from "hono/cookie";
import { verify } from "hono/jwt";

export async function authMiddleware(c: Context, next: Next) {
  const token = await getSignedCookie(c, "cookieSecret", "token");
  if (!token) {
    return c.json({ message: "Authentication required" }, 401);
  }
  try {
    // TODO: 後で.envから呼び出すように変更
    const jwtsecret = "jwtsecret";
    const payload = await verify(token, jwtsecret);
    c.set("userId", payload.sub);
    await next();
  } catch (err) {
    return c.json({ message: "Invalid token" }, 401);
  }
}
