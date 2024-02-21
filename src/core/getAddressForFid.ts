

/**
 * This function returns the connected Ethereum address for an FID.
 * @param fid: The FID of a user.
 * @returns The Ethereum address of the user.
 */

export const getAddressForFid = async (fid: number) => {
  const res = await fetch(`https://hub.pinata.cloud/v1/verificationsByFid?fid=${fid}`)
   const json = await res.json();
  
   const address = json.messages.map((m: any) => m.data.verificationAddAddressBody.address)
   return address[0]
  }
  