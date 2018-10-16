import fs from 'fs';
import path from 'path';

/**
  config root
*/
const configRoot = 'config/';


/**
  define read file asnyc
*/
const readFileAsync = async filename => new Promise((resolve) => {
  fs.readFile(filename, (err, data) => {
    if (err) throw err;
    resolve(data);
  });
});


/**
  extracts config at a given location
  - note, we use FS to facilitate testing
*/
const extractConfig = async (env) => {
  const configPath = path.join(configRoot, `${env}.json`);
  const contents = await readFileAsync(configPath);
  const json = JSON.parse(contents);
  return json;
};


export default extractConfig;
