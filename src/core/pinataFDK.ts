import { getFrameMetadata } from "./getFrameMetadata";
import { validateFrameMessage } from "./validateFrameMessage";
import { FrameHTMLType } from "./types";
import { FrameActionPayload } from "./types";
import { PinataConfig } from "./types";
import { decodedFrameMetadata } from "./decodedFrameMetadata";
import { Message } from "@farcaster/hub-nodejs";
import { sendAnalytics } from "./sendAnalytics";

export class PinataFDK {
    config: PinataConfig | undefined

    constructor(config?: PinataConfig) {
        this.config = config
    }

    getFrameMetadata(metadata: FrameHTMLType): Promise<string>{
        return getFrameMetadata(metadata, this.config)
    }

    validateFrameMessage(payload: FrameActionPayload): Promise<{
        isValid: boolean;
        message: Message | undefined;
      }>{
        return validateFrameMessage(payload)
    }

    decodedFrameMetadata(metadata: FrameHTMLType): Promise<Record<string, string>>{
        return decodedFrameMetadata(metadata, this.config)
    }
    sendAnalytics(frame_id: string, frame_data: FrameActionPayload, custom_id?: string): Promise<{ success: boolean }>{
        return sendAnalytics(frame_id, frame_data, this.config, custom_id)
    }
}
