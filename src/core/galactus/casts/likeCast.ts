/**
 * This function will like a cast based on the hash of the cast
 * @param CastDelete: Required fields are hash of the cast and the signerId of the user who is likeing the cast
 * @returns CastResponse: The raw response from the Farcaster Hub
 */

import { PinataConfig, CastResponse, LikeCast } from "../../types";

export const likeCast = async (
  req: LikeCast,
  config: PinataConfig | undefined,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/casts/${req.hash}/reactions/like?signerId=${req.signerId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config?.pinata_jwt}`,
        }
      },
    );
    const res = await request.json();
    const resData: CastResponse = res.data
    return resData
  } catch (error) {
    throw error;
  }
};
