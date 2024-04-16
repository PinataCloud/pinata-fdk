/**
 * This function fetchs all channels a Farcaster user is following.
 * @param fid: The fid of the user to fetch channels following.
 * @returns ChannelsFollowingResponse: The raw response from the Pinata Farcaster API.
 */

import { ChannelsFollowingResponse, PinataConfig} from "../../types";

export const getChannelsFollowing = async (
  config: PinataConfig | undefined,
  fid: number, 
  pageToken?: string,
) => {
  try {
    let url = `https://api.pinata.cloud/v3/farcaster/users/${fid}/channels_following`;
    if(pageToken){
        url = url.concat(`?pageToken=${pageToken}`)
    }
    const request = await fetch(url , {
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
