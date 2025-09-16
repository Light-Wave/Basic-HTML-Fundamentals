let sortedArray = [];
let randomArray = [];
for (let i = 0; i < 10; i++) {
  sortedArray[i] = i;
}
for (let i = 0; i < 10; i++) {
  const randomNumber = Math.floor(Math.random() * sortedArray.length);
  randomArray[i] = sortedArray[randomNumber];
  sortedArray.splice(randomNumber, 1);
}
console.log(randomArray);
