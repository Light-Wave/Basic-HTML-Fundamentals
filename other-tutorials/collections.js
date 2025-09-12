"use strict";
console.log();
let prompt = require("prompt-sync")();

const names = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
console.log("Names length: " + names.length);
console.log(names);

names[5] = "Frank";
console.log("Names length: " + names.length);
console.log(names);

/*
const arr = new Array();
let sum = 0;
for (let i = 0; i < 10; i++) {
  arr[i] = Number(prompt("Enter number " + (i + 1) + ": "));
  sum += arr[i];
}

let arrStr = "| ";
for (let i = 0; i < arr.length; i++) {
  arrStr += arr[i] + " | ";
}
console.log(arrStr);
console.log("Sum: " + sum);
*/
