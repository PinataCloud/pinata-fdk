/**
 * This function fetchs all fids following a Farcaster channel.
 * @param name: The name of the channel to fetch followers.
 * @param pageToken: The page token to fetch the next page of users.
 * @returns ChannelFollowers: The raw response from the Pinata Farcaster API.
 */

import { PinataConfig, ChannelFollowers} from "../../types";

export const getChannelFollowers = async (
  config: PinataConfig | undefined,
  name: string,
  pageToken?: string,
) => {
  try {
    let url = `https://api.pinata.cloud/v3/farcaster/channels/${name}/followers`;
    if(pageToken){
        url = `${url}?pageToken=${pageToken}`
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
    const resData: ChannelFollowers = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
