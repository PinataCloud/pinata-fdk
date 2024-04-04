/**
 * This function will follow a user by FID
 * @param fid: FID for the target user
 * @returns CastResponse: The raw response from the Farcaster Hub
 */

import { PinataConfig, CastResponse, FollowUser } from "./types";

export const followUser = async (
  req: FollowUser,
  config: PinataConfig | undefined,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/follow/${req.fid}?signerId=${req.signerId}`,
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
