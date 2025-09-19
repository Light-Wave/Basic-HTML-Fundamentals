"use strict";

class BankAccount {
  owner;
  balance;
  accountID;
  static existingAccountCount = 0;
  constructor(owner, startingBalance = 0) {
    owner.addAccount(this);
    this.owner = owner;
    this.accountID = BankAccount.existingAccountCount;
    BankAccount.existingAccountCount++;
    this.balance = startingBalance;
  }
  printInfo() {
    console.log("owner: " + this.owner.emailID);
    console.log("balance: " + this.balance);
    console.log("accountID: " + this.accountID);
  }
  resolveMonth() {}
}
class SavingsAccount extends BankAccount {
  interest;
  withdrawalsThisMonth;
  monthlyWithdrawals;

  constructor(owner, interest, monthlyWithdrawals, startingBalance = 0) {
    super(owner, startingBalance);
    this.interest = interest;
    this.monthlyWithdrawals = monthlyWithdrawals;
    this.withdrawalsThisMonth = 0;
  }
  resolveMonth() {
    withdrawalsThisMonth = 0;
    balance *= 1 + interest;
  }
  printInfo() {
    super.printInfo();
    console.log("interest: " + this.interest);
    console.log("withdrawalsThisMonth: " + this.withdrawalsThisMonth);
    console.log("monthlyWithdrawals: " + this.monthlyWithdrawals);
  }
}
class LoanAccount extends BankAccount {
  interest;
  monthlyPayment;
  paidThisMonth = 0;
  constructor(owner, interest, monthlyPayment, startingBalance = 0) {
    super(owner, startingBalance);
    this.interest = interest;
    this.monthlyPayment = monthlyPayment;
  }
  resolveMonth() {
    if (this.balance < 0) {
      this.balance *= interest;
    }
    if (paidThisMonth < monthlyPayment) {
      //TODO: Uh-oh
    }
  }
  printInfo() {
    super.printInfo();
    console.log("interest: " + this.interest);
    console.log("monthlyPayment: " + this.monthlyPayment);
    console.log("paidThisMonth: " + this.paidThisMonth);
  }
}
class Customer {
  accounts;
  customerID;
  name;
  emailID;
  static existingIDs;
  constructor(emailID, name) {
    if (Customer.existingIDs == null) {
      Customer.existingIDs = new Set();
    }
    if (emailID == null || emailID == "") {
      console.log("No EmailID provided.");
      return undefined;
    }
    if (Customer.existingIDs.has(emailID)) {
      console.log("User with ID " + emailID + " already exists.");
      return undefined;
    }
    this.name = name;
    this.emailID = emailID;
    Customer.existingIDs.add(emailID);
    this.customerID = Customer.existingIDs.size;
    this.accounts = new Set();
  }
  addAccount(account) {
    this.accounts.add(account);
  }
  printInfo() {
    console.log("");
    console.log("emialId: " + this.emailID);
    console.log("name: " + this.name);
    console.log("customerID: " + this.customerID);
    console.log("number of accounts " + this.accounts.size);
    this.accounts.forEach((account) => {
      console.log("##################################");
      account.printInfo();
    });
    console.log("");
  }
}

const customers = [];
const bankAccounts = [];

customers[0] = new Customer("aa@bb.cc", "Koughat");
customers[1] = new Customer("aa@bb.cc", "Wurgoth");
customers[2] = new Customer("12@bb.cc", "Wurmha");
customers[3] = new Customer("34@bb.cc", "Orgug");
customers[4] = new Customer("56@bb.cc", "Shuzug");
customers[5] = new Customer("jregh@lexicon.com", "Jregh");

bankAccounts[0] = new SavingsAccount(customers[0], 0.05, 3, 100);
bankAccounts[1] = new SavingsAccount(customers[0], 0.05, 3, 5);
bankAccounts[2] = new SavingsAccount(customers[2], 0.05, 3);
bankAccounts[3] = new SavingsAccount(customers[3], 0.05, 3, 1000000);
bankAccounts[4] = new SavingsAccount(customers[0], 0.05, 3, 200);

bankAccounts[5] = new LoanAccount(customers[0], 0.1, 100, 1000);
bankAccounts[6] = new LoanAccount(customers[0], 0.1, 100, 1000);
bankAccounts[7] = new LoanAccount(customers[2], 0.1, 100, 1000);
bankAccounts[8] = new LoanAccount(customers[3], 0.1, 100, 1000);
bankAccounts[9] = new LoanAccount(customers[0], 0.1, 100, 1000);

for (let i = 0; i < customers.length; i++) {
  if (customers[i].emailID == undefined) {
    console.log("Skipping missing customer");
    continue;
  }
  customers[i].printInfo();
}
