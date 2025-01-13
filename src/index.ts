import { serve } from "@hono/node-server";
import user from "./presentation/auth/userRouter.js";
import task from "./presentation/task/taskRouter.js";
import post from "./presentation/post/postRouter.js";
import like from "./presentation/like/likeRouter.js";
import comment from "./presentation/comment/commentRouter.js";
import { middlewareFactory } from "./middleware/appMiddleware.js";

const app = middlewareFactory.createApp().basePath("/api");
app.route("/", user);
app.route("/", task);
app.route("/", post);
app.route("/", like);
app.route("/", comment);

serve({
  fetch: app.fetch,
  port: 3001,
});
