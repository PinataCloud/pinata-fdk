/**
 * This function polls Warpcast after a signer has been created and the user is approving the signer key. Once it is approved it is saved in the DB.
 * @param token: Polling token provided by Warpcast when creating a signer
 * @returns Signer UUID used in other parts of the Farcaster API, Public Key, and if the Signer is approved.
 */

import { PinataConfig, SignedKeyRequest } from "../../types";

export const pollSigner = async (
  token: string,
  config: PinataConfig | undefined,
) => {
  try {
    const request = await fetch(
      `https://api.pinata.cloud/v3/farcaster/poll_warpcast_signer?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config?.pinata_jwt}`,
        },
      },
    );
    const res = await request.json();
    const keyRequest: SignedKeyRequest = res.data.result.signedKeyRequest;
    return keyRequest;
  } catch (error) {
    throw error;
  }
};
