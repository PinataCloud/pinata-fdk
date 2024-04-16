import { getUsers } from '../src/core/pinata/users/getUsers';
import { PinataConfig } from '../src';

describe('getUsers function', () => {
  let originalFetch: typeof fetch;
  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should fetch users without page token', async () => {
    const mockConfig: PinataConfig = { pinata_jwt: 'test_jwt', pinata_gateway: 'test.cloud'};
    const mockResponse = {
      data: [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }],
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
    const mockConfig: PinataConfig = { pinata_jwt: 'mock_jwt' };
    const mockResponse = {
      data: [{ id: 3, name: 'User 3' }, { id: 4, name: 'User 4' }],
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
    const mockConfig: PinataConfig = { pinata_jwt: 'mock_jwt' };
    const mockError = new Error('Failed to fetch');
    global.fetch = jest.fn().mockRejectedValueOnce(mockError);

    await expect(getUsers(mockConfig)).rejects.toThrow(mockError);
  });
});
