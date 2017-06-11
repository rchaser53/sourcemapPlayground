const fs = require('fs');

const testjsJSON = JSON.parse(fs.readFileSync('./dist/sourcemapTest.js.map'));
const testUglifyJSON = JSON.parse(fs.readFileSync('./dist/sourcemapTest.min.js.map'));

const transfer = require("multi-stage-sourcemap").transfer;
const cToAMap = transfer({
  fromSourceMap: testUglifyJSON,
  toSourceMap: testjsJSON
});

let data = '';
const readStream = fs.createReadStream('./dist/sourcemapTest.min.js', {
  encoding: 'utf8'
});

readStream.on('data', (chunk) => {
  data += chunk;
})
readStream.on('end', (chunk) => {
  data += `\r\n //# sourceMappingURL=sourcemapTest.min.js.result.map`;
  fs.writeFileSync('./dist/sourcemapTest.min.js', data)
})

fs.writeFileSync('dist/sourcemapTest.min.js.result.map', cToAMap)