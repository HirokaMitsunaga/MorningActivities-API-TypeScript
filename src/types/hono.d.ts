import { ClientRequestOptions } from "hono/client";

declare module "hono/client" {
  interface ClientRequestOptions {
    json?: unknown;
  }
}
