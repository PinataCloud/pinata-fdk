/**
 * This function sends a request to create a Farcaster Signer using Pinata Farcaster Auth. This is the unsponsored flow which requires signing a key.
 * @body appFid: The FID of the app account creating a signer, e.g. Supercast.
 * @returns Signer UUID used in other parts of the Farcaster API, Public Key, and if the Signer is approved.
 */

import {
  PinataConfig,
  WarpcastPayload,
  SIGNED_KEY_REQUEST_TYPE,
  SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
  SignerInfo,
} from "./types";
import { mnemonicToAccount } from "viem/accounts";

export const createSigner = async (config: PinataConfig | undefined) => {
  try {
    const appFid = config?.app_fid || "";
    const res = await fetch("https://api.pinata.cloud/v3/farcaster/signers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config?.pinata_jwt}`,
      },
      body: JSON.stringify({
        app_fid: parseInt(appFid, 10),
      }),
    });
    const signerInfo = await res.json();
    const {
      data,
    }: {
      data: SignerInfo;
    } = signerInfo;
    const account = mnemonicToAccount(
      process.env.FARCASTER_DEVELOPER_MNEMONIC!,
    );

    const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day
    const requestFid = parseInt(appFid);
    const signature = await account.signTypedData({
      domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
      types: {
        SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
      },
      primaryType: "SignedKeyRequest",
      message: {
        requestFid: BigInt(appFid),
        key: `0x${data.public_key}`,
        deadline: BigInt(deadline),
      },
    });

    const registerResponse = await fetch(
      `https://api.pinata.cloud/v3/farcaster/register_signer_with_warpcast`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: JSON.stringify({
          signer_id: data.signer_uuid,
          signature: signature,
          deadline: deadline,
          app_fid: requestFid,
          app_address: account.address,
        }),
      },
    );

    const warpcastPayload = await registerResponse.json();
    const resultData: WarpcastPayload = warpcastPayload.data
    return resultData;
  } catch (error) {
    throw error;
  }
};
