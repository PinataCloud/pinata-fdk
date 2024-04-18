import { getUsers } from "../../../src/core/pinata/users/getUsers";
import { PinataConfig} from "../../../src";

describe('getUsers function', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch users without page token', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" }
    const mockResponse = {
        data: {
            users: [
                {
                    "fid": 1,
                    "custody_address": "0x8773442740c17c9d0f0b87022c722f9a136206ed",
                    "recovery_address": "0x00000000fcb080a4d6c39a9354da9eb9bc104cd7",
                    "following_count": 2,
                    "follower_count": 12853,
                    "verifications": [
                        "0x86924c37a93734e8611eb081238928a9d18a63c0"
                    ],
                    "bio": "A sufficiently decentralized social network. farcaster.xyz",
                    "display_name": "Farcaster",
                    "pfp_url": "https://i.imgur.com/I2rEbPF.png",
                    "username": "farcaster",
                    "power_badge_user": true
                },
            ],
            "next_page_token": "eyJvZmZzZXQiOiIxMDAifQ"
        }
    };
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getUsers(mockConfig);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.pinata.cloud/v3/farcaster/users',
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

  it('should fetch users with page token', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "test.cloud" }
    const mockResponse = {
        data: {
            users: [
                {
                    "fid": 1,
                    "custody_address": "0x8773442740c17c9d0f0b87022c722f9a136206ed",
                    "recovery_address": "0x00000000fcb080a4d6c39a9354da9eb9bc104cd7",
                    "following_count": 2,
                    "follower_count": 12853,
                    "verifications": [
                        "0x86924c37a93734e8611eb081238928a9d18a63c0"
                    ],
                    "bio": "A sufficiently decentralized social network. farcaster.xyz",
                    "display_name": "Farcaster",
                    "pfp_url": "https://i.imgur.com/I2rEbPF.png",
                    "username": "farcaster",
                    "power_badge_user": true
                },
            ],
            "next_page_token": "eyJvZmZzZXQiOiIxMDAifQ"
        }
    };
   
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getUsers(mockConfig, 'mockPageToken');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.pinata.cloud/v3/farcaster/users?pageToken=mockPageToken',
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

    await expect(getUsers(mockConfig)).rejects.toThrow(mockError);
  });
});
