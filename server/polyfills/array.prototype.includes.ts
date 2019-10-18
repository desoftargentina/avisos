// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill
function pollyfill() {
  Array.prototype.includes = function(searchElement: any /*, fromIndex*/) {
    'use strict';
    const O = Object(this);
    const len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    const n = parseInt(arguments[1], 10) || 0;
    let k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {
        k = 0;
      }
    }
    let currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement) {
        // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}

export default pollyfill;
