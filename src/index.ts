import { serve } from "@hono/node-server";
import user from "./presentation/auth/userRouter.js";
import task from "./presentation/task/taskRouter.js";
import post from "./presentation/post/postRouter.js";
import like from "./presentation/like/likeRouter.js";
import comment from "./presentation/comment/commentRouter.js";
import commentLike from "./presentation/commentLike/commentLikeRouter.js";
import { middlewareFactory } from "./middleware/appMiddleware.js";
import { logger } from "hono/logger";

const app = middlewareFactory.createApp().basePath("/api");
app.use(logger());
app.route("/", user);
app.route("/", task);
app.route("/", post);
app.route("/", like);
app.route("/", comment);
app.route("/", commentLike);

serve({
  fetch: app.fetch,
  port: 3001,
});
