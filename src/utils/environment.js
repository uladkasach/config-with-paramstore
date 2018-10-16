
/**
  determines environment type based on env, NODE_ENV, or defaults to test
*/
const determineEnvironment = (env) => {
  let environment;
  if (env) environment = env; // if end is defined, define environment to that
  if (!environment) environment = process.env.NODE_ENV; // if `env` was not defined, use env.NODE_ENV
  if (!environment) environment = 'test'; // fall back to `test` if still not defined
  return environment;
};


export default determineEnvironment;
