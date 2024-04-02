/**
 * This signer lists all signers you have listed under your account
 * @param fid: Filter results by FID
 * @returns List of signers with their UUIDs and if they are revoked or not
 */

import {
  PinataConfig,
  SignerList,
} from "./types";

export const getSigners = async (config: PinataConfig | undefined, fid?: number) => {
  try {
    let url
    if(fid){
      url = `https://api.pinata.cloud/v3/farcaster/signers?fid=${fid}`
    } else {
      url = `https://api.pinata.cloud/v3/farcaster/signers`
    }
    const req = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config?.pinata_jwt}`,
      }
    });
    const res = await req.json();
    const resultData: SignerList = res.data
    return resultData
  } catch (error) {
    throw error;
  }
};
