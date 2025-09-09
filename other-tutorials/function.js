"use strict";

let prompt = require("prompt-sync")();

function isEven(num) {
  if (num % 2 == 0) {
    return "Is Even";
  } else {
    return "Is Odd";
  }
}
function greet(first, last) {
  console.log("Introducing " + first + " " + last + "!");
}

function calculateAge(birthYear, first, last) {
  const currentYear = new Date().getFullYear();
  greet(first, last);
  console.log("They are " + (currentYear - birthYear) + " years old.");
}

const input = Number(prompt("Enter a number: "));
console.log(isEven(input));

const firstName = prompt("Enter your first name: ");
const lastName = prompt("Enter your last name: ");
greet(firstName, lastName);

const dateOfBirth = Number(prompt("Enter your year of birth: "));
calculateAge(dateOfBirth, firstName, lastName);

function checkPrime(num) {
  if (num <= 1) {
    return false;
  }
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}
const potentialPrime = Number(prompt("Enter a number: "));
console.log(checkPrime(potentialPrime) ? "Is Prime" : "Not Prime");
