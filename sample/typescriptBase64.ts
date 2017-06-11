const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function base64FormatEncode(inValue: number) {
    if (inValue < 64) {
        return base64Chars.charAt(inValue);
    }

    throw TypeError(inValue + ": not a 64 based value");
}

function base64VLQFormatEncode(inValue: number) {
    // Add a new least significant bit that has the sign of the value.
    // if negative number the least significant bit that gets added to the number has value 1
    // else least significant bit value that gets added is 0
    // eg. -1 changes to binary : 01 [1] => 3
    //     +1 changes to binary : 01 [0] => 2
    if (inValue < 0) {
        inValue = ((-inValue) << 1) + 1;
    }
    else {
        inValue = inValue << 1;
    }

    // Encode 5 bits at a time starting from least significant bits
    let encodedStr = "";
    do {
        let currentDigit = inValue & 31; // 11111
        inValue = inValue >> 5;
        if (inValue > 0) {
            // There are still more digits to decode, set the msb (6th bit)
            currentDigit = currentDigit | 32;
        }
        encodedStr = encodedStr + base64FormatEncode(currentDigit);
    } while (inValue > 0);

    return encodedStr;
}