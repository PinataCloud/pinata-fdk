import { AnalyticsOptions, PinataConfig } from "../core/types";
import { sendAnalytics } from "../core/analytics/sendAnalytics";
import type { MiddlewareHandler } from "hono";


export const analyticsMiddleware = (
  options: AnalyticsOptions,
  config: PinataConfig | undefined
): MiddlewareHandler => {
  return async function analyticsMiddleware(c, next) {
    if (!config) {
      throw new Error("Pinata configuration required to send analytics.");
    }
    try {
      if (c.req.method === "POST") {
        const body = await c.req.json();
        await sendAnalytics(
          options.frameId,
          body,
          config,
          options.customId,
        );
      }
      await next();
    } catch (error) {
      console.log(error);
      return c.res = new Response("Error sending analytics");
    }
  };
};
