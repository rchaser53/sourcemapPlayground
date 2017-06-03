const testjsJSON = {"version":3,"file":"test.js","sourceRoot":"","sources":["test.ts"],"names":[],"mappings":"AAGA,OAAO,CAAC,GAAG,CAAC,OAAO,CAAC,CAAA;AACpB,OAAO,CAAC,GAAG,CAAC,GAAG,CAAC,CAAA;AAEhB,IAAM,GAAG,GAAG,UAAC,GAAW;IACtB,MAAM,CAAC;QACL,IAAI,EAAE,GAAG;KACV,CAAA;AACH,CAAC,CAAA"}
const testUglifyJSON = {"version":3,"sources":["test.js"],"names":["console","log","abc","arg","hoge"],"mappings":"AAAAA,QAAQC,IAAI,SACZD,QAAQC,IAAI,KACZ,IAAIC,IAAM,SAAUC,GAChB,OACIC,KAAMD"}

var transfer = require("multi-stage-sourcemap").transfer;
var cToAMap = transfer({fromSourceMap: testUglifyJSON, toSourceMap: testjsJSON});

const fs = require('fs');
fs.writeFileSync('test.min.js.result.map', cToAMap)

console.log(cToAMap)