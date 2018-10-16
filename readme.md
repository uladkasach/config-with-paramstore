# config-with-paramstore

AWS Paramstore enables you to store secrets on amazon's servers. The AWS-SDK provides a way to retreive secrets from this vault on their servers. This package uses the flat object keys of your config file to replace every __PLACEHOLDER__ in your config file with the velue found in the AWS parameter store for that flat object key.

### Simple Example:

config.json
```
{
  database: {
    username: 'dummyuser',
    password: '__PLACEHOLDER__'
  },
}
```

is converted into
```
{
  'database.username': 'dummyuser',
  'database.password': '__PASSWORD__',
}
```

and then the value for the key 'database.password' is retreived from parameter store and replaces __PASSWORD__.

# Installation
### 1. define the base key of your config. this enables you to group together keys per service under a unique namespace.

### 2. create keys in AWS Param Store through the AWS Console

### 3. create your config file

# Usage

### example:
