import { getChannels } from "../../../src/core/pinata/channels/getChannels";
import { PinataConfig } from "../../../src";
import { ChannelsResponse } from "../../../src";

describe('getChannels function', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch channels without page token', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" }
    const mockResponse: ChannelsResponse = {
            data: {
                channels: [
                    {
                        name: "bharat",
                        url: "https://warpcast.com/~/channel/bharat",
                        display_name: "भारत",
                        description: "भारत, अर्थात् इंडिया",
                        image_url: "https://i.imgur.com/7Y2MCiq.jpg",
                        lead_fid: 228245,
                        created_at: 1709667740,
                        host_fids: [
                            228245
                        ],
                        follower_count: 23
                    },
                ],
                next_page_token: "eyJvZmZzZXQiOiIxMDAifQ"
            }
        }
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getChannels(mockConfig);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.pinata.cloud/v3/farcaster/channels',
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
    const mockResponse: ChannelsResponse = {
        data: {
            channels: [
                {
                    name: "bharat",
                    url: "https://warpcast.com/~/channel/bharat",
                    display_name: "भारत",
                    description: "भारत, अर्थात् इंडिया",
                    image_url: "https://i.imgur.com/7Y2MCiq.jpg",
                    lead_fid: 228245,
                    created_at: 1709667740,
                    host_fids: [
                        228245
                    ],
                    follower_count: 23
                },
            ],
            next_page_token: "eyJvZmZzZXQiOiIxMDAifQ"
        }
    }
   
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getChannels(mockConfig, 'mockPageToken');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.pinata.cloud/v3/farcaster/channels?pageToken=mockPageToken',
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

    await expect(getChannels(mockConfig)).rejects.toThrow(mockError);
  });
});
