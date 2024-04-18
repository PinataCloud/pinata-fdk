/**
 * This function fetchs the status of a specific user following a specific channel.
 * @param fid: The fid of the user to check if they are following the channel.
 * @param name: The channel name to check the user's following status.

 * @returns ChannelFollowingStatus: The raw response from the Pinata Farcaster API.
 */

import { ChannelFollowingStatus, PinataConfig} from "../../types";

export const getChannelsFollowingStatus = async (
  config: PinataConfig | undefined,
  fid: number, 
  name: string,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}/channels_following/${name}/status`,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: ChannelFollowingStatus = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
