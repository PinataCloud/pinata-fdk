import { getChannelFollowers } from "../../../src/core/pinata/channels/getChannelFollowers";
import { PinataConfig } from "../../../src";
import { ChannelFollowersResponse } from "../../../src";

describe('getChannelFollowers function', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch channel followers without page token', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" }
    const name = "pinata";
    const mockResponse: ChannelFollowersResponse = {
            data: {
                followers: [
                    {
                        "fid": 478108,
                        "followed_at": 1713262433
                    },
                ],
                next_page_token: "eyJvZmZzZXQiOiIxMDAifQ"
            }
        }
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getChannelFollowers(mockConfig, "pinata");
    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/channels/${name}/followers`,
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

  it('should fetch channels with page token', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" }
    const mockResponse: ChannelFollowersResponse = {
        data: {
            followers: [
                {
                    "fid": 478108,
                    "followed_at": 1713262433
                },
            ],
            next_page_token: "eyJvZmZzZXQiOiIxMDAifQ"
        }
    }
   
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getChannelFollowers(mockConfig, "pinata", 'mockPageToken');
    const name = "pinata";

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/channels/${name}/followers?pageToken=mockPageToken`,
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
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" }
    const mockError = new Error('Failed to fetch');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(getChannelFollowers(mockConfig, "pinata")).rejects.toThrow(mockError);
  });
});
