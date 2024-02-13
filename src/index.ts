import { getFrameMetadata } from "./core/getFrameMetadata";
import { validateFrameMessage } from "./core/validateFrameMessage";
import { FrameHTMLType } from "./core/types";
import { FrameActionPayload } from "./core/types";
import { PinataConfig } from "./core/types";

class PinataFDK {
    config: PinataConfig | undefined

    constructor(config?: PinataConfig) {
        this.config = config
    }

    getFrameMetadata(metadata: FrameHTMLType){
        return getFrameMetadata(metadata, this.config)
    }

    validateFrameMessage(payload: FrameActionPayload){
        return validateFrameMessage(payload)
    }
}
module.exports = PinataFDK;


export default PinataFDK;
export * from "./core/types"
export * from "./core/utils"