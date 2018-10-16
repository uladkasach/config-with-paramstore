module.exports = {
  'extends': 'airbnb-base',
  'rules': {
    'max-len': ["error", 140, { ignoreTrailingComments: true }],
    'object-curly-newline': "off",
  },
  "env" : {
    "jest": true
  }
};
