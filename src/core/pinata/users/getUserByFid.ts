/**
 * This function fetches a specific Farcaster user by fid.
 * @param fid: The fid of the user to fetch.
 * @returns User: The raw response from the Pinata Farcaster API.
 */

import { PinataConfig, User} from "../../types";

export const getUserByFid = async (
  fid: number, 
  config: PinataConfig | undefined,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}`,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: User = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
