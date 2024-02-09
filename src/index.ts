import { getFrameMetadata } from "./core/getFrameMetadata";
import { validateFrameMessage } from "./core/validateFrameMessage";
import { FrameHTMLType } from "./core/types";
import { FrameActionPayload } from "pinata-fdk";
import { PinataConfig } from "./core/types";

class PinataFDK {
    config: PinataConfig | undefined

    constructor(config: PinataConfig) {
        this.config = config
    }
    getFrameMetadata(metadata: FrameHTMLType){
        return getFrameMetadata(metadata, this.config)
    }

    getFrameMessage(message: FrameActionPayload){
        return validateFrameMessage(message)
    }
}
module.exports = PinataFDK;


export default PinataFDK;
export * from "./core/types"
export * from "./core/utils"