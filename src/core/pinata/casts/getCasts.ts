/**
 * This function fetchs all casts from the Pinata Farcaster API.
 * @param pageToken: The page token to fetch the next page of casts.
 * @returns CastsResponse: The raw response from the Pinata API.
 */

import { PinataConfig, CastsResponse } from "../../types";

export const getCasts = async (
  config: PinataConfig | undefined,
  pageToken?: string, 
) => {
  try {
    let url = `https://api.pinata.cloud/v3/farcaster/casts`
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
    const resData: CastsResponse = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
