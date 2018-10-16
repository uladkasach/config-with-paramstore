# config-with-paramstore

AWS Paramstore enables you to store secrets on amazon's servers. The AWS-SDK provides a way to retreive secrets from this vault on their servers. This package uses the flat object keys of your config file to replace every `__PARAM__` in your config file with the velue found in the AWS parameter store for that flat object key.

### Simple Example:

config.json
```json
{
  "parameterStoreNamespace": "my-awesome-app/",
  "database": {
    "username": "dummyuser",
    "password": "__PARAM__"
  }
}
```

is converted into
```json
{
  "database": {
    "username": "dummyuser",
    "password": "some-password found at aws-paramstore:my-awesome-app/database.password"
  }
}
```

I.e., then the value for the key `my-awesome-app/database.password` is retreived from parameter store and replaces `__PARAM__`.

# Installation
### 1. define the base key of your config. this enables you to group together keys per service under a unique namespace.
In your config object, define the key `parameterStoreNamespace` for this functionality.

e.g., if your config is:
```
{
  parameterStoreNamespace: 'my-app/',
  database: {
    username: 'dummyuser',
    password: '__PARAM__'
  },
}
```
then we would retreive the `__PARAM__` value from the parameter store key `my-app/database.password`.


### 2. create keys in AWS Param Store through the AWS Console
https://console.aws.amazon.com/systems-manager/parameters?region=us-east-1


### 3. create your config file

e.g.,

```json
{
  "parameterStoreNamespace": "app-name.service-name.environment",
  "database": {
    "name": "databasename",
    "host": "local",
    "port": 3306,
    "username": "some-user",
    "password" : "__PARAM__"
  }
}
```

# Usage

### example:


config:
```json
{
  "parameterStoreNamespace": "ahbode.service-graphql.local",
  "database": {
    "name": "ahbode-graphql",
    "host": "local",
    "port": 3306,
    "username": "lambda-user",
    "password" : "__PARAM__"
  }
}
```

javascript:
```js
import Config from 'config-with-paramstore';

// initialie config cache
const configInstance = new Config();

(async () => {
  // get default env config
  const config =  await configInstance.get();

  // check that it has been changed from __PARAM__
  expect(config.database.password).not.toEqual('__PARAM__');
})()

```
