import extractConfig from './file';

/**
  define mocks
*/
jest.mock('fs');
// jest.unmock('aws-sdk');

/**
  define tests
*/
describe('retreive config', () => {
  it('should be able to retreive config', async () => {
    const config = await extractConfig('test');
    expect(config).toMatchObject({ mapParam: '__PARAM__', database: { username: 'exampleConfig', password: '__PARAM__' } });
  });
});
