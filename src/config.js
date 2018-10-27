import flatten, { unflatten } from 'flat';
import extractConfig from './utils/file';
import determineEnvironment from './utils/environment';
import extractParamsForConfig from './utils/params';
import extractEnvsForConfig from './utils/envs';

/**
  generate config based on environment
  - no caching, so out of object
*/
const generateConfigForEnvironment = async (env) => {
  // determine env
  const environment = determineEnvironment(env);

  // extract config from config file
  const baseConfig = await extractConfig(environment);
  const flatBaseConfig = flatten(baseConfig); // flatten the base config object

  // extract params from param store
  const flatParams = await extractParamsForConfig(flatBaseConfig); // looks for all `__PARAM__` entries and resolves values for each

  // extract params from environmental variables
  const flatEnvs = await extractEnvsForConfig(flatBaseConfig); // looks for all `__ENV__` entries and resolves values for each

  // merge config object with params
  const flatConfig = Object.assign({}, flatBaseConfig, flatEnvs, flatParams);

  // convert flat configs to normal configs
  const config = unflatten(flatConfig);

  // return config
  return config;
};


/**
  @class Config
  - creates an object that caches environmental variables
*/
class Config {
  constructor() {
    this.cacheOfPromises = []; // empty cache
  }

  async get(env) {
    // if not in cache, place into cache
    if (!this.cacheOfPromises[env]) this.cacheOfPromises[env] = generateConfigForEnvironment(env);

    // return result of cache
    return this.cacheOfPromises[env];
  }
}

// export the configObject
export default Config;
