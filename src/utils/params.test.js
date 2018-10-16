import extractParamsForConfig from './params';

/**
  define mocks
*/
jest.mock('aws-sdk');
// jest.unmock('aws-sdk');

/**
  define tests
*/
describe('retreive parameters', async () => {
  it('should retreive parameters for root level __PARAM__', async () => {
    const params = await extractParamsForConfig({ testKey: '__PARAM__' });
    expect(params).toMatchObject({
      testKey: 'testKey-value',
    });
  });
  it('should retreive parameters for root level __PARAM__, with namespace', async () => {
    const params = await extractParamsForConfig({ parameterStoreNamespace: 'test.', testKey: '__PARAM__' });
    expect(params).toMatchObject({
      testKey: 'test.testKey-value',
    });
  });
  it('should add period to parameter store namespace key if period not at end of namespace', async () => {
    const params = await extractParamsForConfig({ parameterStoreNamespace: 'test', testKey: '__PARAM__' });
    expect(params).toMatchObject({
      testKey: 'test.testKey-value',
    });
  });
});
