/**
 * This function fetchs all Farcaster channels from the Pinata Farcaster API.
 * @param pageToken: The page token to fetch the next page of channels.
 * @returns ChannelsResponse: The raw response from the Pinata Farcaster API.
 */

import { ChannelsResponse, PinataConfig} from "../../types";

export const getChannels = async (
  config: PinataConfig | undefined,
  pageToken?: string, 
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/channels?pageToken=${pageToken}`,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: ChannelsResponse = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
