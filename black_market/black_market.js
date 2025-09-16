"use strict";

/*Task


Implement following tasks

1. User input 5 products and store them in a set. Make sure if user re enters the product it should not be added to Set.

2. Use a loop to display every product and ask user to enter the price for it. Store the product and price in a Map.

3. Design a menu to display all product names and price from the map

4. Once product is selected – ask for the quantity

5. Then calculate the total cost of the product.

6. Check if the user wants to proceed to purchase again or to check out.

7. If purchase is selected repeat task 2

8. If the checkout option is selected display the total price of all purchases.

9. Ask user to enter the price to pay.

10. In case the user has paid more than the total purchase price then display the return amount.

11. Display the most expensive product and the least expensive product from purchased products

Optional: display the return cost in following format based on the return price

1000 X number of laps (1, 2 or more)

500 X number of laps

200 X number of laps

100 X number of laps

50 X number of laps

20 X number of laps

10 X number of laps

5 X number of laps

2 X number of laps

1 X number of laps*/

const produce = [
  {
    name: "Apple",
    imgSrc: "lorc/shiny-apple",
    color: "green",
    price: 5.68,
    unit: "sek/each",
    increment: 1,
  },
  {
    name: "Monkey's Paw",
    imgSrc: "darkzaitzev/severed-hand",
    color: "brown",
    price: 15,
    unit: "sek/finger",
    increment: 0.2,
  },
  {
    name: "Tesseract salt",
    imgSrc: "delapouite/powder-bag",
    color: "white",
    price: 3,
    unit: "sek/cm⁴",
    increment: 1,
  },
  {
    name: "Apple (Not Cursed)",
    imgSrc: "lorc/shiny-apple",
    color: "green",
    price: 6.68,
    unit: "sek/each",
    increment: 1,
  },
  {
    name: "Unsorted True Names",
    imgSrc: "corked-tube",
    color: "purple",
    price: 18,
    unit: "sek/each",
    increment: 1,
  },
];
const itemDiv = document.getElementById("items");
const totalDiv = document.getElementById("total");

function renderItems() {
  for (let i = 0; i < produce.length; i++) {
    const newDiv = document.createElement("div");
    newDiv.className = "produce";

    const nameSpan = document.createElement("h3");
    nameSpan.innerText = produce[i].name;
    newDiv.appendChild(nameSpan);

    let priceSpan = document.createElement("span");
    priceSpan.innerText = produce[i].price + " " + produce[i].unit + " ";
    priceSpan.className = "priceSpan";
    newDiv.appendChild(priceSpan);

    let ammountInput = document.createElement("input");
    ammountInput.type = "number";
    produce[i].ammountInput = ammountInput;
    ammountInput.onchange = calcTotal;
    newDiv.appendChild(ammountInput);

    let costSpan = document.createElement("span");
    costSpan.className = "costSpan";
    produce[i].costSpan = costSpan;
    newDiv.appendChild(costSpan);

    itemDiv.appendChild(newDiv);
  }
}
function calcTotal() {
  let total = 0;
  for (let i = 0; i < produce.length; i++) {
    let partCost = produce[i].ammountInput.value * produce[i].price;
    produce[i].costSpan.innerText = partCost + " sek";
    total += partCost;
  }
  total = total.toFixed(2);
  totalDiv.innerText = total + " sek";
}
renderItems();
