import { FrameActionPayload, PinataConfig} from './types';

type DataObject = {
    data: FrameActionPayload;
    frame_id: string;
    custom_id?: string; // Make custom_id optional
}


/**
 * This function sends frame data to track analytics.
 * @param frame_id: The id representing the frame.
 * @param frame_data: The Frame Action data produced by Farcasater.
 * @param custom_id: A unique identifier to segment requests within the specified frame (Optional) 
 * @returns Success message boolean.
 */

export async function sendAnalytics(frame_id: string, frame_data: FrameActionPayload, config: PinataConfig | undefined, custom_id?: string) {
    if(!config){
      throw new Error('Pinata configuration required to send analytics.')
    } 
    const postData: DataObject = {
        frame_id: frame_id,
        data: frame_data

    } 
    if (custom_id) {
        postData.custom_id = custom_id;
    }

    try {
        const result = await fetch(
            "https://api.pinata.cloud/farcaster/frames/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config?.pinata_jwt}`
                },
                body: JSON.stringify(postData),
            }
        );

        if (result.ok) {
            return { success: true };
        } else {            
            throw new Error(`Request failed with status ${result.status}`);
        }
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
}

