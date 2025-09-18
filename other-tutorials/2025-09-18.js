"use strict";

let promt = require("prompt-sync")();
/*
class Circle {
  radius;
  aarea;
  circuference;

  constructor() {
    console.log("object created");
  }
}

const c1 = new Circle(3.4);
c1.radius = 2.2;

console.log(c1.radius);

*/

class Employee {
  #pNum;
  constructor(empID, name, email, salary) {
    this.empID = empID;
    this.name = name;
    this.email = email;
    this.salary = salary;
    this.#pNum = "001111-xxxx";
  }
}

const emp = new Employee(1, "Nalini P", "nalini.p@abc.com", 10000);
console.log(emp.pNum);
