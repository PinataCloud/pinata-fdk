import { getChannelByName } from "../../../src/core/pinata/channels/getChannelByName";
import { ChannelResponse, PinataConfig } from "../../../src";

describe('getChannelByName function', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch a channel by name', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockChannelName = 'pinata';
    const mockResponse: ChannelResponse = {
        data: {
            name: "pinata",
            url: "https://warpcast.com/~/channel/pinata",
            display_name: "pinata",
            description: "Build on IPFS and Farcaster at Scale | https://docs.pinata.cloud/farcaster/farcaster-api/getting-started",
            image_url: "https://i.imgur.com/u4mGk5b.gif",
            lead_fid: 20591,
            created_at: 1706890562,
            host_fids: [
                20591,
                4823,
                6023
            ],
            follower_count: 492
        }
    }
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getChannelByName(mockConfig, mockChannelName);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/channels/${mockChannelName}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockConfig.pinata_jwt}`,
        },
      }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error if fetch fails', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockChannelName = 'test_channel';
    const mockError = new Error('Failed to fetch');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(getChannelByName(mockConfig, mockChannelName)).rejects.toThrow(mockError);
  });
});
