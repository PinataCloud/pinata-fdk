/**
 * This function fetchs all Farcaster channels.
 * @param pageToken: The page token to fetch the next page of channels.
 * @returns Channels: The raw response from the Pinata Farcaster API.
 */

import { Channels, PinataConfig} from "../../types";

export const getChannels = async (
  config: PinataConfig | undefined,
  pageToken?: string, 
) => {
  try {
    let url = `https://api.pinata.cloud/v3/farcaster/channels`
      if(pageToken){
        url = url.concat(`?pageToken=${pageToken}`)
      }
    const request = await fetch(
      url,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: Channels = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
