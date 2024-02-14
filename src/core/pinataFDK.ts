import { getFrameMetadata } from "./getFrameMetadata";
import { validateFrameMessage } from "./validateFrameMessage";
import { FrameHTMLType } from "./types";
import { FrameActionPayload } from "./types";
import { PinataConfig } from "./types";
import { decodedFrameMetadata } from "./decodedFrameMetadata";
import { FrameActionMessage } from "@farcaster/core";

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
        message: FrameActionMessage | undefined;
      }>{
        return validateFrameMessage(payload)
    }

    decodedFrameMetadata(metadata: FrameHTMLType): Promise<Record<string, string>>{
        return decodedFrameMetadata(metadata, this.config)
    }
}
