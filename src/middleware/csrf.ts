import { csrf } from "hono/csrf";

export const csrfMiddleware = csrf({
  origin: ["http://localhost:3002"],
});
