import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import user from "./presentation/userRouter.js";
import task from "./presentation/taskRouter.js";

const app = new Hono().basePath("/api");

//ミドルウェアの設定
app.use("*", prettyJSON());
app.use(logger());

app.route("/", user);
app.route("/", task);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
