import { AudienceLabService } from './audiencelab.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AudienceLabService', () => {
  let service: AudienceLabService;

  beforeEach(() => {
    service = new AudienceLabService();
    mockedAxios.create.mockReturnValue({ defaults: { headers: {} }, post: jest.fn(), get: jest.fn() } as any);
  });

  test('setApiKey and getApiKey', () => {
    service.setApiKey('test');
    expect(service.getApiKey()).toBe('test');
  });

  test('createAxiosInstance uses api key', () => {
    service.setApiKey('abc');
    service.createAxiosInstance();
    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({ headers: expect.objectContaining({ 'geeklab-api-key': 'abc' }) })
    );
  });

  test('handleError throws formatted message', () => {
    expect(() => service.handleError({ response: { status: 401, data: 'fail' } })).toThrow(
      'API key is not valid.'
    );
  });

  test('handleError without response', () => {
    expect(() => service.handleError(new Error('oops'))).toThrow('Failed to communicate with the server.');
  });
});
