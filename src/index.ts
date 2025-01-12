import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import user from "./presentation/auth/userRouter.js";
import task from "./presentation/task/taskRouter.js";
import post from "./presentation/post/postRouter.js";
import like from "./presentation/like/likeRouter.js";
import { corsMiddleware } from "./middleware/cors.js";
import { csrfMiddleware } from "./middleware/csrf.js";
import { every, some } from "hono/combine";
import { requestId } from "hono/request-id";
import type { RequestIdVariables } from "hono/request-id";
import { contextStorage } from "hono/context-storage";
import { customLogger } from "./middleware/customLogger.js";

const app = new Hono().basePath("/api");

//ミドルウェアの設定
app.use("*", contextStorage()); // Context Storageを有効化
app.use("*", requestId());
app.use("*", customLogger);
app.use("*", every(corsMiddleware, csrfMiddleware));
app.use("*", prettyJSON());

app.route("/", user);
app.route("/", task);
app.route("/", post);
app.route("/", like);

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
