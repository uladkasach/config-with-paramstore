import AWS from 'aws-sdk';

/**
  define param store service
*/
const ssm = new AWS.SSM();

/**
  extractParamsForConfig
  @param flatConfig
  1. find all __PARAM__ values in the flattened config object
  2. convert configObject flattened keys to AWS Parameter Store Keys for each __PARAM__
    - considers the parameterStoreNamespace, passed from config.parameterStoreNamespace
  3. retreive value of each __PARAM__ from parameter store
*/
const extractParamsForConfig = async (flatConfig) => {
  // 1. find all __PARAM__ values in flattened object
  const paramKeys = Object.keys(flatConfig) // find all keys for which...
    .filter(key => flatConfig[key] === '__PARAM__'); // ... value in object == '__PARAM__'

  // 2. convert paramKeys to AWS Parameter Store Keys
  const { parameterStoreNamespace } = flatConfig;
  const existsPeriodAtEndOfNamespace = (parameterStoreNamespace && parameterStoreNamespace[parameterStoreNamespace.length - 1] === '.'); // if parameterStoreNamespace exists, check if period at end
  const normalizationModifier = (existsPeriodAtEndOfNamespace) ? '' : '.'; // add period if one does not exist;
  const normalizedNameSpace = (parameterStoreNamespace) ? parameterStoreNamespace + normalizationModifier : undefined; // if parameterStoreNamespace exists, normalize it
  const awsParamKeys = paramKeys.map((key) => {
    let normalizedKey = key;
    if (normalizedNameSpace) normalizedKey = normalizedNameSpace + normalizedKey; // prepend normalizedNameSpace
    return normalizedKey;
  });

  // 3. retreive value for each awsParamKey
  const { Parameters, InvalidParameters } = await ssm.getParameters({ Names: awsParamKeys, WithDecryption: true }).promise();
  if (InvalidParameters.length > 0) throw new Error(`found invalid parameters: ${JSON.stringify(InvalidParameters)}`); // throw error if invalids

  // 4. create object of parameters resolved
  const params = {};
  awsParamKeys.forEach((key, index) => {
    const keyWithoutNamespace = (normalizedNameSpace) // remove first `normalizedNameSpace.length;` chars, if normalizedNameSpace exists
      ? key.substring(normalizedNameSpace.length)
      : key;
    params[keyWithoutNamespace] = Parameters[index].Value; // get the value of the corrosponding key
  });

  // 5. return the resultant params
  return params;
};


export default extractParamsForConfig;
