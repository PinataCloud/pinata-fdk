/**
 * This function fetchs all channels a Farcaster user is following.
 * @param fid: The fid of the user to fetch channels following.
 * @returns ChannelsFollowingResponse: The raw response from the Pinata Farcaster API.
 */

import { ChannelsFollowingResponse, PinataConfig} from "../../types";

export const getChannelsFollowing = async (
  fid: number, 
  config: PinataConfig | undefined,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}/channels_following`,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: ChannelsFollowingResponse = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
