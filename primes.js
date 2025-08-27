"use strict";
let i = 1;
let primes = [];

function CalcNext() {
  i++;
  let sqrt = Math.sqrt(i);
  for (let j = 0; j < primes.length && primes[j] <= sqrt; j++) {
    if ((i / primes[j]) % 1.0 == 0.0) {
      CalcNext();
      return;
    }
  }
  primes.push(i);
  console.log(i);
}
setInterval(CalcNext, 1);
