import { PinataFDK } from "../core/pinataFDK";


export async function analyticsMiddleware(context: any, frameId: string, pinataFDK: PinataFDK, next: any, customId?: string) {
    try {
        if (context.req.method === "POST") {
            if(!pinataFDK.config?.pinata_jwt || !pinataFDK.config?.pinata_jwt){
                throw new Error('Pinata configuration required to send analytics.')
            }
            const body = await context.req.json();
            const status = await pinataFDK.sendAnalytics(frameId, body, customId);
            return status;
        }
    await next();
    } catch (error) {
     console.log(error) 
    }
       
}