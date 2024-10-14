// Examples:
// - decodeBencode("5:hello") -> "hello"
// - decodeBencode("10:hello12345") -> "hello12345"
function decodeBencode(bencodedValue: string): string|number {
    /* This function is used to decode a bencoded string
    The bencoded string is a string that is prefixed by the length of the string
    **/

    // Check if the first character is a digit
    if (!isNaN(parseInt(bencodedValue[0]))) {
        const firstColonIndex = bencodedValue.indexOf(":");
        if (firstColonIndex === -1) {
            throw new Error("Invalid encoded value");
        }
        return bencodedValue.substring(firstColonIndex + 1);
    }
    else if (bencodedValue[0] === 'i') {
        const match = bencodedValue.match(/\d+/g);
        if (match) {
            return parseInt(match[0], 10); // Convert the first match to a number
        } else {
            throw new Error("Invalid encoded value"); // Handle the case where no digits are found
        }
     
    } else {
        throw new Error("Only strings are supported at the moment");
    }
}

const args = process.argv;
const bencodedValue = args[3];

if (args[2] === "decode") {
    try {
        const decoded = decodeBencode(bencodedValue);
        console.log(JSON.stringify(decoded));
    } catch (error:any) {
        console.error(error.message);
    }
}
