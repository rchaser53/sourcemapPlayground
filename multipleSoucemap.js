const fs = require('fs');

const testjsJSON = JSON.parse(fs.readFileSync('./test.js.map'));
const testUglifyJSON = JSON.parse(fs.readFileSync('./test.min.js.map'));

const transfer = require("multi-stage-sourcemap").transfer;
const cToAMap = transfer({fromSourceMap: testUglifyJSON, toSourceMap: testjsJSON});

let data = '';
const readStream = fs.createReadStream('./test.min.js', {
  encoding: 'utf8'
});

readStream.on('data', (chunk) => {
  data += chunk;
})
readStream.on('end', (chunk) => {
  data += `\r\n //# sourceMappingURL=test.min.js.result.map`;
  fs.writeFileSync('test.min.js', data)
})

fs.writeFileSync('test.min.js.result.map', cToAMap)