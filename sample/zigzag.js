const bit = 8;

const encodeZigZag = (num) => {
  return ((num << 1) ^ (num >> bit - 1))
}
const decodeZigZag = (num) => {
  return ((num >>> 1) ^ -(num & 1))
  return abc
}

console.log('encode', encodeZigZag(1));
console.log('decode', decodeZigZag(1));
