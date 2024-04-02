/**
 * This function sends a request to create a Farcaster Signer using Pinata Farcaster Auth. This is the sponsored flow which covers warps on the user's behalf and doesnt require the developer to sign a key
 * @body appFid: The FID of the app account creating a signer, e.g. Supercast.
 * @returns Signer UUID used in other parts of the Farcaster API, Public Key, and if the Signer is approved.
 */

import {
  PinataConfig,
  WarpcastPayload,
} from "./types";

export const createSponsoredSigner = async (config: PinataConfig | undefined) => {
  try {
    const appFid = config?.appFid || "";
    const req = await fetch("https://api.pinata.cloud/v3/farcaster/sponsored_signers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config?.pinata_jwt}`,
      },
      body: JSON.stringify({
        app_fid: parseInt(appFid, 10),
      }),
    });
    const res = await req.json();
    const resultData: WarpcastPayload = res.data
    return resultData;
  } catch (error) {
    throw error;
  }
};
