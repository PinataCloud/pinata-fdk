import { PinataConfig } from "../core/types";
import { sendAnalytics } from "../core/sendAnalytics";


export async function analyticsMiddleware(context: any, frameId: string, next: any, config: PinataConfig | undefined, customId?: string) {
    if (!config) {
        throw new Error('Pinata configuration required to send analytics.')
    }
    try {
        if (context.req.method === "POST") {
            const body = await context.req.json();
            await sendAnalytics(frameId, body, config, customId);
        }
        await next();
    } catch (error) {
        console.log(error)
        return context.res.send("Error with analytics");
    }

}