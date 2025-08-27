"use strict";

// I will assume that "even numbers <strong>between</strong> 40 to 20" does not include 40 or 20.

for (let i = 38; i > 20; i -= 2) {
  console.log(i);
}

//If 40 and 20 should be included, instead use the following line
// for (let i = 40; i >= 20; i -= 2) {
