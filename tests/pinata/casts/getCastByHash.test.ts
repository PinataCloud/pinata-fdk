import { getCastByHash } from "../../../src/core/pinata/casts/getCastByHash";
import  { PinataConfig } from "../../../src";

describe('getCastByHash function', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch a cast by hash', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockHash = '0x27ec7197ace4365b6004ae4f729c7b46cbc569e2a';
    const mockResponse= {
        data: {
            "fid": 192,
            "hash": "0x27ec7197ace4365b6004ae4f729c7b46cbc569e2",
            "short_hash": "0x27ec7197",
            "thread_hash": null,
            "parent_hash": null,
            "parent_url": null,
            "root_parent_url": null,
            "parent_author": null,
            "author": {
                "uid": 192,
                "fid": 192,
                "custody_address": "0xc2e7484fbd2322a9986bc49f2e87d7fcac019e26",
                "recovery_address": "0x00000000fcb080a4d6c39a9354da9eb9bc104cd7",
                "following_count": 4,
                "follower_count": 52,
                "verifications": [],
                "bio": "@bunches | product, design, quality",
                "display_name": "Tomer Ben-David",
                "pfp_url": "https://warpcast.com/avatar.png?t=1709148185820",
                "username": "tome",
                "power_badge_user": false
            },
            "content": "gm everybody, gm",
            "timestamp": "2021-11-12T19:22:34Z",
            "embeds": [],
            "mentions": [],
            "mentionPositions": [],
            "reactions": {
                "likes": [
                    {
                        "fid": 192,
                        "fname": "tome"
                    }
                ]
            },
            "replies": {
                "count": 0
            },
            "mentioned_profiles": []
        }
    }
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result= await getCastByHash(mockConfig, mockHash);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/casts/${mockHash}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockConfig.pinata_jwt}`,
        },
      }
    );
    console.log("result", result)
    console.log("mockResponse", mockResponse.data)

    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error if fetch fails', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" };
    const mockHash = '0x27ec7197ace4365b6004ae4f729c7b46cbc569e2a';
    const mockError = new Error('Failed to fetch');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(getCastByHash(mockConfig, mockHash)).rejects.toThrow(mockError);
  });
});
