const fs = require('fs');
const file = 'd:/projects/pathway/src/components/ApplicationModal.tsx';
const content = fs.readFileSync(file, 'utf8');

const regex = /lang === 'am' \? (['"`])((?:(?!\1)[^\\]|\\.)*)\1\s*:\s*(['"`])((?:(?!\3)[^\\]|\\.)*)\3/g;
let match;
const strings = {};

while ((match = regex.exec(content)) !== null) {
  const amString = match[2];
  const enString = match[4];
  strings[enString] = amString;
}

fs.writeFileSync('d:/projects/pathway/scripts/modal_strings.json', JSON.stringify(strings, null, 2));
console.log("Extracted " + Object.keys(strings).length + " strings.");
