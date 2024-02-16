import { FrameActionPayload, PinataConfig} from './types';


/**
 * This function sends frame data to track analytics.
 * @param frame_data: The Frame Action data produced by Farcasater (req.body)
 * @returns Success message boolean.
 */

export async function sendAnalytics(frame_id: string, frame_data: FrameActionPayload, config: PinataConfig | undefined) {
    if(!config){
      throw new Error('Pinata configuration required to send analytics.')
    }

    frame_data["untrustedData"]["timestamp"] = frame_data.untrustedData.timestamp / 1000;
        
    try {
        const result = await fetch(
            "https://api.pinata.cloud/farcaster/frames/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config?.pinata_jwt}`
                },
                body: JSON.stringify({
                    data: frame_data,
                    frame_id: frame_id
                }),
            }
        );
        if (result.ok) {
            return { success: true };
        } else {
            throw new Error(`Request failed with status ${result.status}`);
        }
    } catch (error) {
        console.error("Error sending analytics:", error);
        return { success: false };
    }
}

