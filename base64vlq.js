const VLQ_BASE_SHIFT = 5;
const VLQ_BASE = 1 << VLQ_BASE_SHIFT;
const VLQ_BASE_MASK = VLQ_BASE - 1;
const VLQ_CONTINUATION_BIT = VLQ_BASE;

let BASE64_DIGITS = [];
let BASE64_DIGIT_MAP = {};

const Action = {
  Encode: "encode",
  Decode: "decode",
  Auto: "auto"
}

var currentAction = Action.Auto;

(function() {
  var charCode = "A".charCodeAt(0);
  for (var i = 0; i < 26; ++i){
    BASE64_DIGITS.push(String.fromCharCode(charCode + i));
  }
  charCode = "a".charCodeAt(0);
  for (var i = 0; i < 26; ++i){
    BASE64_DIGITS.push(String.fromCharCode(charCode + i));
  }
  charCode = "0".charCodeAt(0);
  for (var i = 0; i < 10; ++i){
    BASE64_DIGITS.push(String.fromCharCode(charCode + i));
  }
  BASE64_DIGITS.push("+");
  BASE64_DIGITS.push("/");

  for (var i = 0; i < BASE64_DIGITS.length; ++i){
    BASE64_DIGIT_MAP[BASE64_DIGITS[i]] = i;
  }
})();

const doConvert = (input) => {
  if (!input.length) return setResult("");

  let tentativeAction = (currentAction === Action.Auto)
                          ? Action.Encode
                          : currentAction;
  if (currentAction === Action.Auto) {
    if (input.charAt(0) === "[")
      tentativeAction = Action.Encode;
    else {
      let zeroCode = "0".charCodeAt(0);
      let nineCode = "9".charCodeAt(0);
      for (let i = 0; i < input.length; ++i) {
        const code = input.charCodeAt(i);
        if (code < zeroCode || code > nineCode) {
          tentativeAction = Action.Decode;
          break;
        }
      }
    }
  }

  try {
    const value = JSON.parse(tentativeAction === Action.Decode && input.charAt(0) !== "[" ? ("\"" + input + "\"") : input);

    if (tentativeAction === Action.Encode) {
      if (isFinite(value) || value instanceof Array) {
        encode(value, tentativeAction !== currentAction);
        return;
      }
      throw new Error("", "Invalid input for building Base64 VLQ encoding. Expecting a number or JavaScript array of numbers.");
    } else {
      decode(value);
    }
  } catch (e) {
    throw new Error(e.message)
  }
}

const encode = (value, isAutoConvert) => {
  let result = "";
  if (value instanceof Array) {
    for (var i = 0; i < value.length; ++i) {
      if (isNaN(value[i])){
        throw new Error("Invalid numeric value at index " + i + " (" + value[i] + ")");
      }
      result += encodePrimitive(value[i]);
    }
    return setResult(result);
  }

  setResult(encodePrimitive(value), (isAutoConvert ? "Automatically ran Base64 VLQ ENCODING. If you need to DECODE your input, choose the \"Decode\" action." : ""));
}

const decode = (value) => {
  if (typeof value !== "string") {
    throw new Error('Invalid input')
  }
  var result = [];
  var segmentsInLine;
  var numbersInSegment;
  var shift = 0;
  var continuation;
  var lines = value.split(";");

  for (var curLine = 0; curLine < lines.length; ++curLine) {
    var segments = lines[curLine].split(",");
    segmentsInLine = [];
    for (var curSegment = 0; curSegment < segments.length; ++curSegment) {
      var segment = segments[curSegment];
      var resultValue = 0;
      numbersInSegment = [];
      for (var i = 0; i < segment.length; ++i) {
        var c = segment.charAt(i);
        digit = BASE64_DIGIT_MAP[c];

        if (digit === undefined){
          return setResult("", "Invalid digit at index " + i + " ('" + c + "')");
        }

        continuation = digit & VLQ_CONTINUATION_BIT;
        digit &= VLQ_BASE_MASK;
        resultValue += digit << shift;
        shift += VLQ_BASE_SHIFT;

        if (continuation === 0) {
          const isNegative = (resultValue & 1) == 1;
          resultValue >>= 1;
          numbersInSegment.push(isNegative ? -resultValue : resultValue);

          resultValue = 0;
          shift = 0;
        }
      }
      if (numbersInSegment.length){
        segmentsInLine.push(numbersInSegment);
      }
    }
    result.push(segmentsInLine);
  }

  if (!continuation) {
    const decodedData = decodedResultForOutput(result);
    return setResult(decodedData[0], "", decodedData[1]);
  }

  throw new Error("Invalid VLQ64 encoding, continuation bit set at last character while decoding.");
}

const decodedResultForOutput = (result) => {
  if (result.length === 1 && result[0].length === 1)
    return [JSON.stringify(result[0][0]), ""];

  var output = [];
  var sourceMapOutput = [];
  var outIndex = 0;
  var context = {};
  for (var i = 0; i < result.length; ++i) {
    if (!result[i].length)
      continue;
    var mapped = result[i].map(function(segment) {
      return JSON.stringify(segment);
    }, null);
    output[outIndex] = i + ") " + mapped.join(", ");
    sourceMapOutput[outIndex] = buildLineDecodedMappings(i, result[i], context);
    context.prevSourceColumn = 0;
    ++outIndex;
  }
  return [output.join("\n"), sourceMapOutput.join("\n")];
}

const buildLineDecodedMappings = (targetLine, segments, context) => {
  var result = [];
  var prevTargetColumn = 0;
  for (var i = 0; i < segments.length; ++i) {
    var segment = segments[i];
    var targetColumn = prevTargetColumn + segment[0];
    prevTargetColumn = targetColumn;
    var sourceIndex = (context.prevSourceIndex || 0) + segment[1];
    context.prevSourceIndex = sourceIndex;
    var sourceLine = (context.prevSourceLine || 0) + segment[2];
    context.prevSourceLine = sourceLine;
    var sourceColumn = (context.prevSourceColumn || 0) + segment[3];
    context.prevSourceColumn = sourceColumn;
    result.push("([" + sourceLine + "," + sourceColumn + "](#" + sourceIndex + ")=>[" + targetLine + "," + targetColumn + "])");
  }
  return result.join(" | ");
}

const encodePrimitive = (value) => {
  if (value < 0){
    value = ((-value) << 1) | 1
  } else {
    value <<= 1;
  }

  result = "";
  do {
    digit = value & VLQ_BASE_MASK;
    value >>>= VLQ_BASE_SHIFT;
    if (value > 0){
      digit |= VLQ_CONTINUATION_BIT;
    }
    result += BASE64_DIGITS[digit];
  } while (value > 0);

  return result;
}

const setResult = (result, messageText, mappingsResult) => {
  console.log('result', result)
  console.log('messageText', messageText)
  console.log('rmappingsResult', mappingsResult)
}
