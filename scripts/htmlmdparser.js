const specChars = {
};

/**
 * Takes a string and processes the markdown and converts it into its string equivalent
 * @param {String} str String to be processed
 */
function processText(str) {
  if (str === undefined) { return; }
  const strLines = str.split('\n');
  const processedLines = [];

  for (const line of strLines) {
    processedLines.unshift(line);
  }
}

/**
 * Process the MD into HTML for the headings
 * @param {Character Array} charA character array to be processed
 */
function processHeadings(charA) {
  let headingLevel = 0;
  for (let i = 0; i < charA.length && i <= 6; i++) {
    if (charA[i] != '#') {
      break;
    } else {
      headingLevel += 1;
    }
  }

  if (headingLevel === 0) { return charA.join(''); }

  return `<h${headingLevel}>${charA.join('').substring(headingLevel)}</h${headingLevel}>`;
}
