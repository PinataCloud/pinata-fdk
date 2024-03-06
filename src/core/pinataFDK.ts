import { getFrameMetadata } from "./getFrameMetadata";
import { validateFrameMessage } from "./validateFrameMessage";
import { FrameHTMLType, ReplayResponse, UserData, FrameActionPayload, AnalyticsOptions } from "./types";
import { PinataConfig } from "./types";
import { decodedFrameMetadata } from "./decodedFrameMetadata";
import { Message } from "@farcaster/core";
import { sendAnalytics } from "./sendAnalytics";
import { convertUrlToIPFS } from "./convertUrlToIPFS";
import { getUserByFid } from "./getUserByFid";
import { getAddressForFid } from "./getAddressForFid";
import { checkForReplays } from "./checkForReplay";
import { analyticsMiddleware } from "../middleware/analyticsMiddleware"


const formatConfig = (config: PinataConfig | undefined) => {
    let gateway = config?.pinata_gateway;
    if(config && gateway){
        if(gateway && !gateway.startsWith('https://')){
            gateway = `https://${gateway}`;
        }
        config.pinata_gateway = gateway;
    }
    return config
}

export class PinataFDK {
    config: PinataConfig | undefined

    constructor(config?: PinataConfig) {
        this.config = formatConfig(config)
    }
    getFrameMetadata(metadata: FrameHTMLType): string{
        return getFrameMetadata(metadata, this.config)
    }

    validateFrameMessage(payload: FrameActionPayload): Promise<{
        isValid: boolean;
        message: Message | undefined;
      }>{
        return validateFrameMessage(payload)
    }

    decodedFrameMetadata(metadata: FrameHTMLType): Record<string, string>{
        return decodedFrameMetadata(metadata, this.config)
    }

    sendAnalytics(frame_id: string, frame_data: FrameActionPayload, custom_id?: string): Promise<{ success: boolean }>{
        return sendAnalytics(frame_id, frame_data, this.config, custom_id)
    }

    convertUrlToIPFS(url: string): Promise<string | undefined>{
        return convertUrlToIPFS(url, this.config)
    }

    getUserByFid(fid: number): Promise<UserData>{
        return getUserByFid(fid)
    }

    getEthAddressForFid(fid: number): Promise<string>{
        return getAddressForFid(fid)
    }

    checkForReplays(frame_id: string, frame_data: FrameActionPayload) : Promise<ReplayResponse> {
        return checkForReplays(frame_id, frame_data, this.config)
    }

    analyticsMiddleware(options: AnalyticsOptions) {
        return analyticsMiddleware(options, this.config)
    }
 }
