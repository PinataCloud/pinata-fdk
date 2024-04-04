/**
 * This function lets users send casts with signIds created from Farcaster Auth
 * @param cast: Follows the CastAddBody structure of the Farcaster Hub API
 * @returns CastResponse: The raw response from the Farcaster Hub
 */

import { PinataConfig, CastRequest, CastResponse } from "./types";

export const sendCast = async (
  cast: CastRequest,
  config: PinataConfig | undefined,
) => {
  try {
    const data = JSON.stringify(cast)
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/casts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config?.pinata_jwt}`,
        },
        body: data
      },
    );
    const res = await request.json();
    const resData: CastResponse = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
