/**
 * Returns the image source for the SDHQ ratings.
 * @param {0 | 1 | 2 | 3 | 4 | 5} rating
 * @return {string}
 */
function ratingImg(rating) {
  return `https://steamdeckhq.com/misc/rating-${rating}-star.svg`;
}

export default ratingImg;
