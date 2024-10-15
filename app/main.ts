type BEncodeValue = string | number | Array<BEncodeValue>;

function decodeBencode(bencodedValue: string): [BEncodeValue, number] {
  const isString = (val: string): boolean => {
    return !isNaN(parseInt(val.split(":")[0]));
  };

  const isInt = (val: string): boolean => {
    return val[0] === "i";
  };

  const isList = (val: string): boolean => {
    return val[0] === "l";
  };

  // Check if the bencodedValue is a string
  if (isString(bencodedValue)) {
    const strlen = parseInt(bencodedValue.split(":")[0]);
    const firstColonIndex = bencodedValue.indexOf(":");
    if (firstColonIndex === -1) {
      throw new Error("Invalid encoded value");
    }
    return [
      bencodedValue.substring(firstColonIndex + 1, firstColonIndex + 1 + strlen),
      firstColonIndex + 1 + strlen,
    ];
  }

  // Check if the bencodedValue is an integer
  else if (isInt(bencodedValue)) {
    const endOfInt = bencodedValue.indexOf("e");
    if (endOfInt === -1) {
      throw new Error("Invalid encoded value");
    }
    return [parseInt(bencodedValue.substring(1, endOfInt)), endOfInt + 1];
  }

  // Check if the bencodedValue is a list
  else if (isList(bencodedValue)) {
    const decodedList: BEncodeValue[] = [];
    let offset = 1;
    while (offset < bencodedValue.length) {
      if (bencodedValue[offset] === "e") {
        break;
      }
      const [decodedValue, encodedLength] = decodeBencode(bencodedValue.substring(offset));
      decodedList.push(decodedValue);
      offset += encodedLength;
    }
    return [decodedList, offset + 1];
  }

  // If none of the above types matched, throw an error
  else {
    throw new Error("Unsupported type");
  }
}

const args = process.argv;
const bencodedValue = args[3];

if (args[2] === "decode") {
  try {
    const [decoded] = decodeBencode(bencodedValue);
    console.log(JSON.stringify(decoded));
  } catch (error: any) {
    console.error(error.message);
  }
}
