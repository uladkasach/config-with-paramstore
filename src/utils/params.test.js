import AWS from 'aws-sdk';
import extractParamsForConfig from './params';

// define the mock function we use to evaluate whether we call aws
const ssm = new AWS.SSM();

/**
  define mocks
*/
jest.mock('aws-sdk');
// jest.unmock('aws-sdk');

/**
  define tests
*/
beforeEach(() => {
  ssm.getParameters.mockClear();
});
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
  it('should not call aws if no param keys are requested', async () => {
    const params = await extractParamsForConfig({ parameterStoreNamespace: 'test', testKey: '__ENV__' });
    expect(params).toMatchObject({});
    expect(ssm.getParameters.mock.calls.length).toEqual(0);
  });
  it('should call parameter store once per key required', async () => {
    const params = await extractParamsForConfig({ parameterStoreNamespace: 'test', testKey: '__PARAM__', testKeyTwo: '__PARAM__' });
    expect(params).toMatchObject({
      testKey: 'test.testKey-value',
      testKeyTwo: 'test.testKeyTwo-value',
    });
    expect(ssm.getParameters.mock.calls.length).toEqual(2);
  });
});
