import flatten from 'flat';
import extractEnvsForConfig, { getParametersFromEnvironmentalVariables } from './envs';

describe('getParametersFromEnvironmentalVariables', () => {
  it('should be able to find a valid env var value', () => {
    const testKey = 'testConfig_database_password';
    process.env[testKey] = '12';
    const { Parameters, InvalidParameters } = getParametersFromEnvironmentalVariables([testKey]);
    expect(Parameters.length).toEqual(1);
    expect(Parameters[0]).toMatchObject({
      Value: '12',
      Key: testKey,
    });
    expect(InvalidParameters.length).toEqual(0);
  });
  it('should detect invalid env var', () => {
    const testKey = 'testConfig_database_passwordz';
    const { Parameters, InvalidParameters } = getParametersFromEnvironmentalVariables([testKey]);
    expect(Parameters.length).toEqual(0);
    expect(InvalidParameters.length).toEqual(1);
    expect(InvalidParameters[0]).toEqual(testKey);
  });
});

describe('extractEnvsForConfig', () => {
  process.env.testKey = 'testKey-value';
  process.env.test_testKey = 'test_testKey-value';
  process.env.test_testKey_passcode = 'passcodeExpected';
  it('should retreive env vars for root level __ENV__', async () => {
    const params = await extractEnvsForConfig({ testKey: '__ENV__' });
    expect(params).toMatchObject({
      testKey: 'testKey-value',
    });
  });
  it('should retreive env vars for root level __ENV__, with namespace', async () => {
    const params = await extractEnvsForConfig({ environmentVariableNamespace: 'test_', testKey: '__ENV__' });
    expect(params).toMatchObject({
      testKey: 'test_testKey-value',
    });
  });
  it('should add period to namespace key if underscore not at end of namespace', async () => {
    const params = await extractEnvsForConfig({ environmentVariableNamespace: 'test', testKey: '__ENV__' });
    expect(params).toMatchObject({
      testKey: 'test_testKey-value',
    });
  });
  it('should retreive env vars for nested level __ENV__', async () => {
    const baseConfig = { environmentVariableNamespace: 'test_', testKey: { passcode: '__ENV__' } };
    const flatBaseConfig = flatten(baseConfig); // flatten the base config object
    const params = await extractEnvsForConfig(flatBaseConfig);
    expect(params).toMatchObject({
      'testKey.passcode': 'passcodeExpected',
    });
  });
});
