
/**
 * This function returns user data associated with a given fid.
 * @param fid: The FID of a user.
 * @returns Data associated with the user.
 */

export const getUserByFid = async (fid: number) => {
    const res = await fetch(`https://hub.pinata.cloud/v1/userDataByFid?fid=${fid}`)
    const json = await res.json();
    const { messages } = json;
    const usernamePayload = messages.find((m: any) => m.data.userDataBody.type === "USER_DATA_TYPE_USERNAME")
    const username = usernamePayload.data.userDataBody.value;
    const pfpPayload = messages.find((m: any) => m.data.userDataBody.type === "USER_DATA_TYPE_PFP")
    const pfp = pfpPayload.data.userDataBody.value;
    const bioPayload = messages.find((m: any) => m.data.userDataBody.type === "USER_DATA_TYPE_BIO")
    const bio = bioPayload.data.userDataBody.value;
    return {
      fid: fid, 
      username, 
      pfp, 
      bio
    }
}