/**
 * Trims unnecessary whitespace of a html string.
 * @param {string} html html source string
 * @return {string}
 */
function trimHtml(html) {
  return html
    .replaceAll(/>\s+</g, "><")
    .replaceAll(/>\s+(\w)/g, ">$1")
    .replaceAll(/(\w)\s+</g, "$1<");
}

export default trimHtml;
