import { FrameActionPayload, PinataConfig} from './types';

type DataObject = {
    fid: number;
    frame_id: string;
    cast_hash: string;
    message_bytes: string;    
}


/**
 * This function sends frame data to and checks if the frame's message signature has been used before.
 * @param frame_id: The id representing the frame.
 * @param frame_data: The Frame Action data produced by Farcasater. 
 * @returns Success message boolean.
 */

export async function checkForReplays(frame_id: string, frame_data: FrameActionPayload, config: PinataConfig | undefined) {
    if(!config){
      throw new Error('Pinata configuration required to send analytics.')
    } 
    const postData: DataObject = {
        frame_id: frame_id,
        fid: frame_data.untrustedData.fid,
        cast_hash: frame_data.untrustedData.messageHash,
        message_bytes: frame_data.trustedData.messageBytes
    } 

    try {
        const result = await fetch(
            "https://api.pinata.cloud/v3/farcaster/frame_message_signature_replay",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config?.pinata_jwt}`
                },
                body: JSON.stringify(postData),
            }
        );

        const response = await result.json();
        return response;
    } catch (error) {
        console.log(error);
        console.error("Error sending analytics:", error);
        return { success: false };
    }
}

