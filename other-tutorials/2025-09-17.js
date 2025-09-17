"use strict";

let promt = require("prompt-sync")();

class Person {
  constructor(fName, lName, age) {
    this.FirstName = fName;
    this.LastName = lName;
    this.age = age;
  }
  introduce() {
    console.log("Hello! I am " + this.FirstName + " " + this.LastName + ".");
  }
}

let person1 = new Person("Nalini", "Phopase", 20);
person1.introduce();
