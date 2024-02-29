import { PinataConfig } from "../core/types";
import { sendAnalytics } from "../core/sendAnalytics";


export async function analyticsMiddleware(context: any, frameId: string, config: PinataConfig, next: any, customId?: string) {
    if(!config){
        throw new Error('Pinata configuration required to send analytics.')
      } 
    try {
        if (context.req.method === "POST") {
            const body = await context.req.json();
            const status = await sendAnalytics(frameId, body, config, customId);
            return status;
        }
    await next();
    } catch (error) {
     console.log(error) 
    }
       
}