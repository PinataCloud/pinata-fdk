import { sendCast } from "../../../src/core/pinata/casts/sendCast";
import { PinataConfig } from "../../../src";

describe('sendCast function', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should send a cast', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "example.cloud" };
    const mockCast ={
        castAddBody: {
          text: "Hello World from  !",
          mentions: [6023],
          mentionsPositions: [18],
          parentUrl: "https://warpcast.com/~/channel/pinata",
          embeds: [
            {
              url: "https://pinata.cloud"
            },
            {
              castId: {
                fid: 6023,
                hash: "0xcae8abd9badbb60c9b610ec264f42ed9f1785c6f",
              }
            }
          ],
          parentCastId: {
            fid: 6023,
            hash: "0xcae8abd9badbb60c9b610ec264f42ed9f1785c6f"
          }
        },
        signerId: "ba2d9f6d-7514-4967-8b52-5a040b7da4a1"
      }
    const mockResponse =  
    {
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

  
    const result = await sendCast(mockCast, mockConfig);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.pinata.cloud/v3/farcaster/casts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockConfig.pinata_jwt}`,
        },
        body: JSON.stringify(mockCast),
      }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error if fetch fails', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: "example.cloud" };
    const mockCast ={
        castAddBody: {
          text: "Hello World from  !",
          mentions: [6023],
          mentionsPositions: [18],
          parentUrl: "https://warpcast.com/~/channel/pinata",
          embeds: [
            {
              url: "https://pinata.cloud"
            },
            {
              castId: {
                fid: 6023,
                hash: "0xcae8abd9badbb60c9b610ec264f42ed9f1785c6f",
              }
            }
          ],
          parentCastId: {
            fid: 6023,
            hash: "0xcae8abd9badbb60c9b610ec264f42ed9f1785c6f"
          }
        },
        signerId: "ba2d9f6d-7514-4967-8b52-5a040b7da4a1"
      }
    const mockError = new Error('Failed to send cast');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(sendCast(mockCast, mockConfig)).rejects.toThrow(mockError);
  });
});
