import { testClient } from "hono/testing";
import { Hono } from "hono";
import { corsMiddleware } from "./cors.js";
import { csrfMiddleware } from "./csrf.js";
import { every } from "hono/combine";

describe("Security Middleware", () => {
  const app = new Hono()
    .use("*", every(csrfMiddleware, corsMiddleware))
    .post("/test", async (c) => {
      // リクエストのOriginヘッダーを確認
      const origin = c.req.header("origin");
      if (origin !== "http://localhost:3002") {
        return c.text("Invalid origin", 403);
      }
      return c.text("OK");
    });

  it("should reject requests from localhost:3000", async () => {
    const client = testClient(app);
    const res = await client.test.$post({
      headers: {
        origin: "http://localhost:3000",
        "content-type": "application/json",
      },
    });
    expect(res.status).toBe(403);
  });
});
