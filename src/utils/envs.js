
/**
  @method getParametersFromEnvironmentalVariables
  @param envVarKeys - list of keys to get values from environment for
  @returns { Parameters, InvalidParameters } - seperates into two groups based on whether values are defined in env
  NOTE: we purposely made the contract look similar to the parameterstore response from aws.
    - if we ever find another source to get parameters from, we can generalize easier
*/
export const getParametersFromEnvironmentalVariables = (envVarKeys) => {
  const Parameters = [];
  const InvalidParameters = [];
  envVarKeys.forEach((key) => {
    const foundValue = process.env[key];
    if (!foundValue) {
      InvalidParameters.push(key); // if not found, record that it was not findable
    } else {
      Parameters.push({ Key: key, Value: foundValue }); // else push the value
    }
  });
  return {
    Parameters,
    InvalidParameters,
  };
};


/**
  extractEnvsForConfig
  @param flatConfig
  1. find all __ENV__ values in the flattened config object
  2. convert configObject flattened keys to environmental variable keys for each __ENV__
    - considers the environmentVariableNamespace parameter, config,environmentVariableNamespace
  3. retreive value of each __ENV__ from the environment
*/
const extractEnvsForConfig = async (flatConfig) => {
  // 1. find all __PARAM__ values in flattened object
  const periodDelimitedParamKeys = Object.keys(flatConfig) // find all keys for which...
    .filter(key => flatConfig[key] === '__ENV__'); // ... value in object == '__ENV__'

  // 1.5. convert all dots in the keys into underscores, since we cant use periods in environmental variables
  const paramKeys = periodDelimitedParamKeys.map(key => key.replace('.', '_'));

  // 2. convert paramKeys to Environmental Variable Keys
  const { environmentVariableNamespace } = flatConfig;
  const existsUnderscoreAtEndOfNamespace = (environmentVariableNamespace //  if parameterStoreNamespace exists,
    && environmentVariableNamespace[environmentVariableNamespace.length - 1] === '_'); // check if underscore at end
  const normalizationModifier = (existsUnderscoreAtEndOfNamespace) ? '' : '_'; // add underscore if one does not exist;
  const normalizedNameSpace = (environmentVariableNamespace) ? environmentVariableNamespace + normalizationModifier : undefined; // if parameterStoreNamespace exists, normalize it
  const envVarKeys = paramKeys.map((key) => {
    let normalizedKey = key;
    if (normalizedNameSpace) normalizedKey = normalizedNameSpace + normalizedKey; // prepend normalizedNameSpace
    return normalizedKey;
  });

  // 3. retreive value for each awsParamKey
  const { Parameters, InvalidParameters } = getParametersFromEnvironmentalVariables(envVarKeys);
  if (InvalidParameters.length > 0) throw new Error(`found invalid parameters: ${JSON.stringify(InvalidParameters)}`); // throw error if invalids

  // 4. create object of parameters resolved
  const params = {};
  envVarKeys.forEach((key, index) => {
    const keyWithoutNamespace = (normalizedNameSpace) // remove first `normalizedNameSpace.length;` chars, if normalizedNameSpace exists
      ? key.substring(normalizedNameSpace.length)
      : key;
    const periodDelimitedKeyWithoutNamespace = keyWithoutNamespace.replace('_', '.');
    params[periodDelimitedKeyWithoutNamespace] = Parameters[index].Value; // get the value of the corrosponding key
  });

  // 5. return the resultant params
  return params;
};

export default extractEnvsForConfig;
