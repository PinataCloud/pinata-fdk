import { CastId, Message } from "@farcaster/core";
import { FrameActionPayload, FrameButtonMetadata, FrameHTMLType, PinataConfig } from "./types";

export function bytesToHexString(bytes: Uint8Array): `0x${string}` {
  return ("0x" + Buffer.from(bytes).toString("hex")) as `0x${string}`;
}

export function getByteLength(str: string): number {
  return Buffer.from(str).byteLength;
}
export function normalizeCastId(castId: CastId): {
  fid: number;
  hash: `0x${string}`;
} {
  return {
    fid: castId.fid,
    hash: bytesToHexString(castId.hash),
  };
}

/**
 * Extracts a Farcaster Message from the trustedData bytes in the `POST` body payload
 */
export function getFrameMessageFromRequestBody(
  body: FrameActionPayload
): Message {
  return Message.decode(
    Buffer.from(body?.trustedData?.messageBytes ?? "", "hex")
  );
}

/**
 * Validates whether the version param is valid
 * @param version the version string to validate
 * @returns true if the provided version conforms to the Frames spec
 */
export function isValidVersion(version: string): boolean {
  // Check if the input is exactly 'vNext'
  if (version === "vNext") {
    return true;
  }

  // Regular expression to match the pattern YYYY-MM-DD
  // ^ asserts position at start of the string
  // \d{4} matches exactly four digits (for the year)
  // - matches the literal "-"
  // \d{2} matches exactly two digits (for the month)
  // - matches the literal "-"
  // \d{2} matches exactly two digits (for the day)
  // $ asserts position at the end of the string
  const pattern = /^\d{4}-\d{2}-\d{2}$/;

  // Test the input against the pattern
  if (!pattern.test(version)) {
    return false;
  }

  return true;
}

export const parseFrameDetails = (frameDetails: FrameHTMLType, config?: PinataConfig): Record<string, string> => {
   const {
    buttons,
    image,
    cid,
    aspect_ratio,
    input,
    post_url,
    refresh_period,
    state,
  } = frameDetails;
    const metadata: Record<string, string> = {
    'fc:frame': 'vNext',
    };
    if(cid && config){
      metadata["og:image"] = `${config.pinata_gateway}/ipfs/${cid}`;
      metadata['fc:frame:image'] = `${config.pinata_gateway}/ipfs/${cid}`;
    }
    else if (image && image.url) {
      metadata["og:image"] = image.url;
      metadata['fc:frame:image'] = image.url;
    } 

    if (input) {
      if (input.text.length > 32) {
        throw new Error("Input text exceeds maximum length of 32 bytes.");
      }
      metadata['fc:frame:input:text'] = input.text;
    }

    if (buttons) {
    if (buttons.length > 4) {
      throw new Error("Maximum of 4 buttons allowed.");
    }
    buttons.forEach((button: FrameButtonMetadata, index: number) => {
      if (!button.label || button.label.length > 256) {
        throw new Error("Button label is required and must be maximum of 256 bytes.");
      }
      metadata[`fc:frame:button:${index + 1}`] = button.label;
      if (button.action) {
        if (!['post', 'post_redirect', 'mint', "link"].includes(button.action)) {
          throw new Error("Invalid button action.");
        }
        metadata[`fc:frame:button:${index + 1}:action`] = button.action;
      } else {
        metadata[`fc:frame:button:${index + 1}:action`] = 'post'; // Default action
      }
      if (button.target) {
        metadata[`fc:frame:button:${index + 1}:target`] = button.target;
      }
    });
    }

    if(aspect_ratio){
    metadata['fc:frame:image:aspect_ratio'] = aspect_ratio;
    }

    if (post_url) {
    metadata['fc:frame:post_url'] = post_url;
    }

    if (refresh_period) {
    if (refresh_period < 0) {
      throw new Error("Refresh period must be a positive number.");
    }
    metadata['fc:frame:refresh_period'] = refresh_period.toString();
    }
    
    if(state) {
      metadata['fc:frame:state'] = encodeURIComponent(JSON.stringify(state))
    }
    return metadata;
}



export const uploadByURL = async (url: string, config: PinataConfig) => {
  try {
    const urlStream = await fetch(url);
    const arrayBuffer = await urlStream.arrayBuffer();
    const blob = new Blob([arrayBuffer]);

    const data = new FormData();
    data.append("file", blob);
    const upload = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.pinata_jwt}`,
      },
      body: data
    });
    const uploadRes = await upload.json();
    return uploadRes;
  } catch (error){
    console.log(error);
    return error;
  }
}


