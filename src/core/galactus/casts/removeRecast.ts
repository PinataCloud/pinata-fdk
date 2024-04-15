/**
 * This function will remove a recast based on the hash of the cast
 * @param CastDelete: Required fields are hash of the cast and the signerId of the user who is removing the recast
 * @returns CastResponse: The raw response from the Farcaster Hub
 */

import { PinataConfig, CastResponse, RecastCast } from "../../types";

export const removeRecast = async (
  req: RecastCast,
  config: PinataConfig | undefined,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/casts/${req.hash}/reactions/recast?signerId=${req.signerId}`,
      {
        method: "DELETE",
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
