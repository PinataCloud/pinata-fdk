/**
 * This function fetchs all Farcaster users following a specific channel from the Pinata Farcaster API.
 * @param pageToken: The page token to fetch the next page of users.
 * @returns ChannelFollowersResponse: The raw response from the Pinata Farcaster API.
 */

import {ChannelFollowersResponse, PinataConfig} from "../../types";

export const getChannelFollowers = async (
  name: string,
  config: PinataConfig | undefined,
  pageToken?: string, 
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/channels/${name}/followers?pageToken=${pageToken}`,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: ChannelFollowersResponse = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
