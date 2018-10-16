const exampleJSON = JSON.stringify({ mapParam: '__PARAM__', database: { username: 'exampleConfig', password: '__PARAM__' } });
const readFile = jest.fn().mockImplementation((filename, callback) => {
  callback(undefined, exampleJSON);
});

export default {
  readFile,
};
