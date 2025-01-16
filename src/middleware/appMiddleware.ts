import { prettyJSON } from "hono/pretty-json";
import { corsMiddleware } from "./cors.js";
import { csrfMiddleware } from "./csrf.js";
import { every } from "hono/combine";
import { requestId } from "hono/request-id";
import { contextStorage } from "hono/context-storage";
import { createFactory } from "hono/factory";

// factoryの作成
export const middlewareFactory = createFactory({
  initApp: (app) => {
    app.use("*", prettyJSON());
    app.use("*", contextStorage());
    app.use("*", requestId());

    if (process.env.NODE_ENV !== "test") {
      app.use("*", every(corsMiddleware, csrfMiddleware));
    }
  },
});
