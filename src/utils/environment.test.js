import determineEnvironment from './environment';

describe('environment', () => {
  afterEach(() => {
    process.env.NODE_ENV = 'test'; // reset baack to original env
  });
  it('should find default, if nothing is sent', () => {
    delete process.env.NODE_ENV;
    const env = determineEnvironment();
    expect(env).toEqual('test');
  });
  it('should find env.NODE_ENV', () => {
    process.env.NODE_ENV = 'dev-test';
    const env = determineEnvironment();
    expect(env).toEqual('dev-test');
  });
  it('should find env from function argument', () => {
    const env = determineEnvironment('super-dev');
    expect(env).toEqual('super-dev');
  });
});
