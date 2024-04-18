/**
 * This function fetchs all Farcaster users.
 * @param pageToken: The page token to fetch the next page of users.
 * @returns Users: The raw response from the Pinata Farcaster API.
 */

import { PinataConfig, Users} from "../../types";

export const getUsers = async (
  config: PinataConfig | undefined,
  pageToken?: string, 
) => {
  try {
    let url = `https://api.pinata.cloud/v3/farcaster/users`;
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
    const resData: Users = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
