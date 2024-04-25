import { PinataConfig } from "../../../src";
import { unfollowUser } from "../../../src/core/pinata/users/unfollowUser";

describe('unfollowUser function', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should unfollow a user', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "example.cloud"};
    const mockRequest = { fid: 3, signerId: 'test_signerId' };
    const mockResponse = {
      data: {
          type: "123",
          fid: 3,
          timestamp: 3,
          network: "123",
          castAddBody: {
          embedsDeprecated: [],
          mentions: [],
          text: "123",
          mentionsPositions: [],
          embeds: [],
          },
      },
      hash: "123",
      hashScheme: "123",
      signature: "123",
      signatureScheme: "123",
      signer: "123",
      dataBytes: "123"
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await unfollowUser(mockRequest, mockConfig);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/follow/${mockRequest.fid}?signerId=${mockRequest.signerId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockConfig.pinata_jwt}`,
        },
      }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error if fetch fails', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "example.cloud"};
    const mockRequest = { fid: 3, signerId: 'test_signerId' };
    const mockError = new Error('Failed to unfollow user');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(unfollowUser(mockRequest, mockConfig)).rejects.toThrow(mockError);
  });
});
