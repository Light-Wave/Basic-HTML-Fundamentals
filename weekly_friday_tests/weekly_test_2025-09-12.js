/*Task

1) Create an array. Fill in the array with any 15 random numbers (Using random function).

2) Display the array

3) Sort the array in ascending order (smallest number to largest number)

4) Display the array

5) Sort the array in descending order (largest number to smallest number)

6) Display the array

7) Store these array elements to another array: while storing add even numbers from front and odd numbers from the end of array

8) Display the array

For example...

If elements are [34, 23 78, 12, 9, 72, 11, 99, 6]

Task 3: Ascending sort: [6, 9, 11, 12, 23, 34, 71, 78, 99]

Task 5: Descending sort [99, 78, 71, 34, 23, 12, 11, 9, 6]

Task 7: [78, 34, 12, 6, 9, 11, 23, 71, 99]*/

"use strict";

const array_length = 9;
const max_value = 100;

// Task 1
const randArray = [];
for (let i = 0; i < array_length; i++) {
  randArray[i] = Math.floor(Math.random() * max_value);
}

// Task 2
console.log(randArray.toString());

// Task 3
randArray.sort((a, b) => a - b);

// Task 4
console.log(randArray.toString());

// Task 5
randArray.sort((a, b) => b - a);

// Task 6
console.log(randArray.toString());

// Task 7
const evenOddArray = [array_length];
let start = 0;
let end = array_length - 1;
for (let i = 0; i < array_length; i++) {
  if (randArray[i] % 2 == 0) {
    evenOddArray[start] = randArray[i];
    start++;
  } else {
    evenOddArray[end] = randArray[i];
    end--;
  }
}

// Task 8
console.log(evenOddArray.toString());
