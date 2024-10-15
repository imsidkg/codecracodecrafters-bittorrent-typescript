function decodeBencode(bencodedValue: string): string | number | Array<string | number> {
    /* This function decodes bencoded strings, integers, and lists */

    // Check if it's a bencoded list starting with 'l'
    if (bencodedValue[0] === 'l') {
        const list: Array<string | number> = [];
        let currentIndex = 1; // Start after 'l'
        
        while (bencodedValue[currentIndex] !== 'e') {
            const element = decodeBencode(bencodedValue.slice(currentIndex));

            // Type guarding: Check if it's an array or not to avoid errors
            if (Array.isArray(element)) {
                list.push(...element); // Flatten if it's an array (optional)
            } else {
                list.push(element);
            }

            // Update currentIndex to move past the decoded element
            if (typeof element === 'string') {
                currentIndex += element.length + element.length.toString().length + 1; // string length + prefix + colon
            } else if (typeof element === 'number') {
                currentIndex += element.toString().length + 2; // length of number + 'i' and 'e'
            }
        }

        return list;
    }
    
    // Check if it's a bencoded string (starts with a number)
    if (!isNaN(parseInt(bencodedValue[0]))) {
        const firstColonIndex = bencodedValue.indexOf(":");
        if (firstColonIndex === -1) {
            throw new Error("Invalid encoded value");
        }
        return bencodedValue.slice(firstColonIndex + 1, firstColonIndex + 1 + parseInt(bencodedValue.slice(0, firstColonIndex)));
    }
    
    // Check if it's a bencoded integer (starts with 'i')
    if (bencodedValue[0] === 'i') {
        const endIndex = bencodedValue.indexOf('e');
        if (endIndex === -1) {
            throw new Error('Invalid encoded value');
        }
        return parseInt(bencodedValue.slice(1, endIndex));
    }
    
    throw new Error("Only strings, integers, and lists are supported at the moment");
}

// Example Usage with CLI arguments
const args = process.argv;
const bencodedValue = args[3];

if (args[2] === "decode") {
    try {
        const decoded = decodeBencode(bencodedValue);

        // Handle different types of return values
        if (Array.isArray(decoded)) {
            console.log(JSON.stringify(decoded)); // If it's an array (list)
        } else {
            console.log(decoded); // If it's a string or number
        }

    } catch (error: any) {
        console.error(error.message)
    }
}
