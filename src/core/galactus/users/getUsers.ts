/**
 * This function fetchs all Farcaster users from the Pinata Farcaster API.
 * @param pageToken: The page token to fetch the next page of users.
 * @returns UsersResponse: The raw response from the Pinata Farcaster API.
 */

import { PinataConfig, UsersResponse} from "../../types";

export const getUsers = async (
  config: PinataConfig | undefined,
  pageToken?: string, 
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/users?pageToken=${pageToken}`,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: UsersResponse = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
