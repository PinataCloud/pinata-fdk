import { PinataConfig} from './types';
import { uploadByURL } from "./utils";


/**
 * This function sends frame data to track analytics.
 * @param url: The url to be uploaded to IPFS.
 * @returns Pinata IPFS URL for the uploaded url.
 */

export async function convertUrlToIPFS(url: string, config: PinataConfig | undefined) {
    if(!config){
        throw new Error('Pinata configuration required to upload url to IPFS.')
    }    
    try {
        const res = await uploadByURL(url, config);
        if(res.IpfsHash){
            return `${config.pinata_gateway}/ipfs/${res.IpfsHash}`;
        }
    } catch (error) {
        throw new Error("Error uploading url to ipfs: " + error);
    }
}

