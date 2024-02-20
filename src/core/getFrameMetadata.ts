import { FrameHTMLType,  PinataConfig} from './types';
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
 * @returns The raw string HTML for a frame.
 */
 
export function getFrameMetadata (frameDetails: FrameHTMLType, config?: PinataConfig): string {
  const metadata: Record<string, string> = parseFrameDetails(frameDetails, config);
  let metaTags = '';
  for (const key in metadata) {
    metaTags += `<meta name="${key}" content="${metadata[key]}">\n`;
  }
  return metaTags;
};
