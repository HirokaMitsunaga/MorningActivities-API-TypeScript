import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { jwt } from "hono/jwt";

export async function authMiddleware(c: Context, next: Next) {
  const token = await getSignedCookie(c, "cookieSecret", "token");
  if (!token) {
    return c.json({ message: "Authentication required" }, 401);
  }
  // JWTミドルウェアの設定
  const middleware = jwt({
    secret: "jwtsecret", // TODO: 後で.envから呼び出すように変更
    cookie: {
      key: "token",
      secret: "cookieSecret",
    },
  });

  try {
    await middleware(c, next);
  } catch (err) {
    return c.json({ message: "Invalid token" }, 401);
  }
}
