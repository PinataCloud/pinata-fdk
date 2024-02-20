import { getFrameMetadata } from "./getFrameMetadata";
import { validateFrameMessage } from "./validateFrameMessage";
import { FrameHTMLType } from "./types";
import { FrameActionPayload } from "./types";
import { PinataConfig } from "./types";
import { decodedFrameMetadata } from "./decodedFrameMetadata";
import { Message } from "@farcaster/hub-nodejs";
import { sendAnalytics } from "./sendAnalytics";
import { convertUrlToIPFS } from "./convertUrlToIPFS";

export class PinataFDK {
    config: PinataConfig | undefined

    constructor(config?: PinataConfig) {
        this.config = config
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
    sendAnalytics(frame_id: string, frame_data: FrameActionPayload): Promise<{ success: boolean }>{
        return sendAnalytics(frame_id, frame_data, this.config)
    }

    convertUrlToIPFS(url: string): Promise<string | undefined>{
        return convertUrlToIPFS(url, this.config)
    }
}
