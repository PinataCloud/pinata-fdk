/**
 * This function fetchs a specific cast by hash from the Pinata Farcaster API.
 * @param castHash: The hash of the cast to fetch.
 * @returns CastByHashResponse: The raw response from the Pinata API. 
 */

import { PinataConfig, CastByHashResponse } from "../../types";

export const getCastByHash = async (
  hash: string, 
  config: PinataConfig | undefined,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/casts/${hash}`,
      {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config?.pinata_jwt}`,
            },      
        },
    );
    const res = await request.json();
    const resData: CastByHashResponse = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
