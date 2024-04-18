/**
 * This function fetchs a specific cast by hash from the Pinata Farcaster API.
 * @param castHash: The hash of the cast to fetch.
 * @returns Cast: The raw response from the Pinata API. 
 */

import { PinataConfig, Cast } from "../../types";

export const getCastByHash = async (
  config: PinataConfig | undefined,
  hash: string, 
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
    const resData: Cast = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
