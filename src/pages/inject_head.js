/** Function to inject the ProtonDB font into the head of a page. */
function injectProtonDBFont() {
  let font = document.createElement("style");
  font.innerText = "@import url('https://fonts.googleapis.com/css2?family=Rationale&display=swap');";
  document.head.appendChild(font);
}

/** Function to inject metadata into the head of a page. */
function injectHead() {
  injectProtonDBFont();
}

export default injectHead;
