import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import user from "./presentation/userRouter.js";

const app = new Hono().basePath("/api");

//ミドルウェアの設定
app.use("*", prettyJSON());
app.route("/", user);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
