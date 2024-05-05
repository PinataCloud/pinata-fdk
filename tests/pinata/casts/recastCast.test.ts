import { recastCast } from "../../../src/core/pinata/casts/recastCast";
import { PinataConfig } from "../../../src";

describe('recastCast function', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should recast a cast', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "example.cloud"};
    const mockRequest = { hash: 'test_hash', signerId: 'test_signerId' };
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

    const result = await recastCast(mockRequest, mockConfig);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://api.pinata.cloud/v3/farcaster/casts/${mockRequest.hash}/reactions/recast?signerId=${mockRequest.signerId}`,
      {
        method: 'POST',
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
    const mockRequest = { hash: 'test_hash', signerId: 'test_signerId' };
    const mockError = new Error('Failed to recast cast');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(recastCast(mockRequest, mockConfig)).rejects.toThrow(mockError);
  });
});
