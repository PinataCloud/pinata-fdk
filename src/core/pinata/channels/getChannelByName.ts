/**
 * This function fetches a specific Farcaster channel by name.
 * @param name: The name of the channel to fetch.
 * @returns Channel: The raw response from the Pinata Farcaster API.
 */

import { PinataConfig, Channel} from "../../types";

export const getChannelByName = async (
  config: PinataConfig | undefined,
  name: string,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/channels/${name}`,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: Channel = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
