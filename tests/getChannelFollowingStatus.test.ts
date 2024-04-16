import { PinataConfig, ChannelFollowingStatusResponse } from "../src";
import { getChannelsFollowingStatus } from "../src/core/pinata/users/getChannelFollowingStatus";

describe('getChannelsFollowingStatus function', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch channel following status', async () => {
    const fid = 1;
    const channelName = "pinata";
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockResponse: ChannelFollowingStatusResponse =   {
        data: {
        following: true,
        followed_at: 23425322
      }}

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ data: mockResponse }),
    });

    const result = await getChannelsFollowingStatus(mockConfig, fid, channelName);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}/channels_following/${channelName}/status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockConfig.pinata_jwt}`,
        },
      }
    );
    console.log(result)

    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error if fetch fails', async () => {
    const fid = 1;
    const channelName = "Channel1";
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockError = new Error('Failed to fetch');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(getChannelsFollowingStatus(mockConfig, fid, channelName)).rejects.toThrow(mockError);
  });
});
