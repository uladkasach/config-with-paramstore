import Config from './config';

/**
  define mocks
*/
jest.mock('fs');
jest.mock('aws-sdk');

/**
  define tests
*/
describe('config', () => {
  it('should be able to evaluate standard config', async () => {
    const configObject = new Config();
    const config = await configObject.get();
    expect(config).toMatchObject({
      mapParam: 'mapParam-value',
      database: {
        username: 'exampleConfig',
        password: 'database.password-value',
      },
    });
  });
});
