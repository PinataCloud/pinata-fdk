import { FrameHTMLType, FrameButtonMetadata} from './types';
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
const FormData = require("form-data");

// export const uploadUrl = async (sourceUrl:string) => {
//   const axiosInstance = axios.create();
//   const data = new FormData();
//   const response = await axiosInstance(sourceUrl, {
//     method: "GET",
//     responseType: "stream",
//   });
//   data.append(`file`, response.data);
//   try {
//     const res: any = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
//       headers: {
//           'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
//           'Authorization': `Bearer ${process.env['PINATA_JWT']}`
//       }
//     });
//     console.log("res", res);
//     return res
//   } catch (error) {
//     return error;
//   }
// };

/**
 * This function generates the head metadata for a Farcaster Frame.
 * @param buttons: The buttons to use for the frame.
 * @param image: The image to use for the frame.
 * @param cid: The cid of the image to use for the frame.
 * @param input: The text input to use for the frame.
 * @param post_url: The URL to post the frame to.
 * @param refresh_period: The refresh period for the image used.
 * @returns The raw HTML for the frame.
 */
 
export function getFrameMetadata ({
  buttons,
  image,
  cid,
  aspectRatio,
  input,
  post_url,
  refresh_period,
}: FrameHTMLType): string {
  const metadata: Record<string, string> = {
    'fc:frame': 'vNext',
  };
  if(cid){
    metadata["og:image"] = `https://${process.env['PINATA_GATEWAY']}/ipfs/${cid}`;
    metadata['fc:frame:image'] = `https://${process.env['PINATA_GATEWAY']}/ipfs/${cid}`;
  }
  // else if (image && image.ipfs) {
  //    const res = await uploadUrl(image.url)
  //    console.log("res", res);
  //     if(res.IpfsHash){
  //       metadata['fc:frame:image'] = `https://${process.env['PINATA_GATEWAY']}/ipfs/${res.IpfsHash}`;
  //     }
  //     else{
  //       throw new Error("Image failed to upload to IPFS.");
  //     }
  // }
  else if (image && !cid) {
    metadata["og:image"] = image;
    metadata['fc:frame:image'] = image;
  } 
  if(aspectRatio){
    metadata['fc:frame:aspectRatio'] = aspectRatio;
  }
  if (input) {
    if (input.text.length > 32) {
      throw new Error("Input text exceeds maximum length of 32 bytes.");
    }
    metadata['fc:frame:input:text'] = input.text;
  }
  // Set frame buttons
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
        if (!['post', 'post_redirect', 'mint'].includes(button.action)) {
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

  // Set frame post URL
  if (post_url) {
    metadata['fc:frame:post_url'] = post_url;
  }

  // Set frame refresh period
  if (refresh_period) {
    if (refresh_period < 0) {
      throw new Error("Refresh period must be a positive number.");
    }
    metadata['fc:frame:refresh_period'] = refresh_period.toString();
  }

  // Construct meta tags
  let metaTags = '';
  for (const key in metadata) {
    metaTags += `<meta name="${key}" content="${metadata[key]}">\n`;
  }
  return metaTags;
};
