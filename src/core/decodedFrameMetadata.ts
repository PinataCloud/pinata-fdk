import { FrameHTMLType, PinataConfig} from './types';
import { parseFrameDetails } from './utils';


/**
 * This function generates the head metadata for a Farcaster Frame.
 * @param buttons: The buttons to use for the frame.
 * @param image: The url to use for the frame and upload IPFS boolean.
 * @param cid: The cid of the image to use for the frame.
 * @param input: The text input to use for the frame.
 * @param post_url: The URL to post the frame to.
 * @param refresh_period: The refresh period for the image used.
 * @param aspect_ratio: The aspect ratio for the image used.
 * @returns The key value pairs of the metadata for a frame.
 */
 
 
export function decodedFrameMetadata (frameDetails: FrameHTMLType, config?: PinataConfig): Record<string, string> {
    const metadata: Record<string, string> =  parseFrameDetails(frameDetails, config);
    return metadata;
};
