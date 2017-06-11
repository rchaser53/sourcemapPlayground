const wantDecode = {
  "version":3,
  "file":"test.js",
  "sourceRoot":"",
  "sources":["test.ts"],
  "names":[],
  "mappings":"AAIA,OAAO,CAAC,GAAG,CAAC,GAAG,CAAC,CAAA;AAEhB,IAAM,GAAG,GAAG,UAAC,GAAW;IACtB,MAAM,CAAC;QACL,IAAI,EAAE,GAAG;KACV,CAAA;AACH,CAAC,CAAA"
};

const nyan = "AAIA,OAAO,CAAC,GAAG,CAAC,GAAG,CAAC,CAAA;AAEhB,IAAM,GAAG,GAAG,UAAC,GAAW;IACtB,MAAM,CAAC;QACL,IAAI,EAAE,GAAG;KACV,CAAA;AACH,CAAC,CAAA";

// const nyan = nyanStr.split(',');

// var buffer2 = new Buffer(base64, 'base64');

// console.log(nyan)

// console.log(Buffer.from(nyan, 'base64'));


console.log('AAIA,OAAO'.toString('base64'))
