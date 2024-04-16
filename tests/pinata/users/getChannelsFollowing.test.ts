import { getChannelsFollowing } from "../../../src/core/pinata/users/getChannelsFollowing";
import { PinataConfig, ChannelsFollowingResponse } from "../../../src";

describe('getChannelsFollowing function', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch channels following without page token', async () => {
    const fid = 3;
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockResponse: ChannelsFollowingResponse = {
            data: {
                channels: [
                    {
                        id: "friendtech-v2",
                        name: "friendtech-v2",
                        url: "https://warpcast.com/~/channel/friendtech-v2",
                        description: "an onchain schelling point for FT and FC",
                        image_url: "https://i.imgur.com/w0eNOE5.jpg",
                        lead_fid: 9412,
                        created_at: 1712938119,
                        host_fids: [
                            9412
                        ],
                        follower_count: 191,
                        followed_at: 1712963458
                    },
                ],
                next_page_token: "eyJwYWdlIjoxLCJsaW1pdCI6MjV9"
            }
        }

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ data: mockResponse }),
    });

    const result = await getChannelsFollowing(mockConfig, fid);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}/channels_following`,
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

  it('should fetch channels following with page token', async () => {
    const fid = 3;
    const pageToken = "mockPageToken";
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockResponse: ChannelsFollowingResponse = {
        data: {
            channels: [
                {
                    id: "friendtech-v2",
                    name: "friendtech-v2",
                    url: "https://warpcast.com/~/channel/friendtech-v2",
                    description: "an onchain schelling point for FT and FC",
                    image_url: "https://i.imgur.com/w0eNOE5.jpg",
                    lead_fid: 9412,
                    created_at: 1712938119,
                    host_fids: [
                        9412
                    ],
                    follower_count: 191,
                    followed_at: 1712963458
                },
            ],
            next_page_token: "eyJwYWdlIjoxLCJsaW1pdCI6MjV9"
        }

    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ data: mockResponse }),
    });

    const result = await getChannelsFollowing(mockConfig, fid, pageToken);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/users/${fid}/channels_following?pageToken=${pageToken}`,
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
    const fid = 1;
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockError = new Error('Failed to fetch');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(getChannelsFollowing(mockConfig, fid)).rejects.toThrow(mockError);
  });
});
