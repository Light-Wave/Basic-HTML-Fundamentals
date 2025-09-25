"use strict";

const races = [
  {
    name: "Human",
    imgSrc: "delapouite/person.svg",
    color: "beige",
    consumption: [{ wheat: 1 }],
    production: [{ money: 1 }],
  },
  {
    name: "Scientist",
    imgSrc: "delapouite/lab-coat.svg",
    color: "lightblue",
    scienceBonus: 1,
  },
  {
    name: "Engineer",
    imgSrc: "delapouite/person.svg",
    color: "orange",
    engineeringBonus: 1,
  },
  {
    name: "Officer",
    imgSrc: "delapouite/police-officer-head.svg",
    color: "red",
    militaryBonus: 1,
  },
  {
    name: "Geologist",
    imgSrc: "delapouite/miner.svg",
    color: "brown",
    geologyBonus: 1,
  },
  {
    name: "Botanist",
    imgSrc: "delapouite/farmer.svg",
    color: "green",
    botanyBonus: 1,
  },
  {
    name: "Medic",
    imgSrc: "delapouite/rod-of-asclepius.svg",
    color: "white",
    medicalBonus: 1,
  },
  {
    name: "Tourist",
    imgSrc: "delapouite/person.svg",
    color: "yellow",
  },
  {
    name: "Child",
    imgSrc: "delapouite/jumping-rope.svg",
    color: "pink",
  },
  {
    name: "Elder",
    imgSrc: "lorc/beard.svg",
    color: "gray",
  },
  {
    name: "Drone",
    imgSrc: "delapouite/tracked-robot.svg",
    color: "gray",
  },
];
const resources = [
  {
    id: "money",
    name: "Gold Coins",
    imgSrc: "lorc/crown-coin.svg",
    color: "gold",
  },
  {
    id: "science",
    name: "Science",
    imgSrc: "lorc/fizzing-flask.svg",
    color: "lightblue",
  },
  {
    id: "energy",
    name: "Electricity",
    imgSrc: "sbed/electric.svg",
    color: "yellow",
  },
  {
    id: "oxygen",
    name: "Oxygen",
    imgSrc: "lorc/fluffy-cloud.svg",
    color: "cyan",
  },
  {
    id: "water",
    name: "Water",
    imgSrc: "sbed/water-drop.svg",
    color: "Blue",
  },
  {
    id: "metal",
    name: "Metal",
    imgSrc: "lorc/metal-bar.svg",
    color: "red",
  },
  {
    id: "concrete",
    name: "Concrete",
    imgSrc: "delapouite/concrete-bag.svg",
    color: "gray",
  },
  {
    id: "food",
    name: "Food",
    imgSrc: "lorc/shiny-apple.svg",
    color: "lime",
  },
  {
    id: "metal_rare",
    name: "Rare Metals",
    imgSrc: "willdabeast/gold-bar.svg",
    color: "gold",
  },
  {
    id: "polymers",
    name: "Polymers",
    imgSrc: "delapouite/plastic-duck.svg",
    color: "gold",
  },
  {
    id: "machine_parts",
    name: "Machine Parts",
    imgSrc: "lorc/gears.svg",
    color: "grey",
  },
  {
    id: "fuel",
    name: "Fuel",
    imgSrc: "delapouite/gas-pump.svg",
    color: "orange",
  },
  {
    id: "electronics",
    name: "Electronic Components",
    imgSrc: "lorc/circuitry.svg",
    color: "lime",
  },
  {
    id: "seed",
    name: "Seeds",
    imgSrc: "delapouite/plant-seed.svg",
    color: "green",
  },
  {
    id: "rocks",
    name: "Rocks",
    imgSrc: "lorc/rock.svg",
    color: "grey",
  },
];
const machines = [
  { name: "Idle", crew: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  {
    name: "Drone Hub",
    producePerProd: [{ ore_iron: 1 }],
  },
  {
    name: "Copper Mine",
    bonusesUsed: ["metalworkingBonus"],
    producePerProd: [{ ore_copper: 1 }],
  },
  {
    name: "Farming",
    bonusesUsed: ["farmingBonus"],
    producePerProd: [{ wheat: 1 }],
  },
  {
    name: "Tin Flowers",
    bonusesUsed: ["farmingBonus", "metalworkingBonus"],
    producePerProd: [{ wheat: 1 }, { ore_tin: 1 }],
  },
  {
    name: "Smelter",
    bonusesUsed: ["metalworkingBonus"],
    producePerProd: [{ iron_ingot: 1 }],
    expensesPerPop: [{ ore_iron: 2 }],
  },
];
let mousedOverCrew = -1;
let mousedOverMachine = -1;
let dragData = null;

function dragCrewStartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.dataset.index);
  const dragedCrews =
    machines[mousedOverCrew.dataset.machine].crew[mousedOverCrew.dataset.race] -
    mousedOverCrew.dataset.index;
  const dragImg = generateCrewBlock(mousedOverCrew.dataset.race, dragedCrews);
  machines[mousedOverCrew.dataset.machine].crew[mousedOverCrew.dataset.race] -=
    dragedCrews;
  dragImg.style.position = "absolute";
  dragImg.style.top = "-1000px";
  dragImg.style.left = "-1000px";
  document.body.appendChild(dragImg);
  ev.dataTransfer.setDragImage(dragImg, 0, 25);
  dragData = {
    originMachine: mousedOverCrew.dataset.machine,
    race: mousedOverCrew.dataset.race,
    count: dragedCrews,
  };
  setTimeout(() => {
    document.body.removeChild(dragImg);
    updateMachineGraphics();
  }, 1);
}

function dragCrewEndHandler(ev) {
  if (mousedOverMachine != -1 && dragData != null) {
    machines[mousedOverMachine.dataset.index].crew[dragData.race] +=
      dragData.count;
  } else {
    machines[dragData.originMachine].crew[dragData.race] += dragData.count;
  }
  dragData = null;
  updateMachineGraphics();
}

function mouseOverCrew(ev) {
  mousedOverCrew = ev.target;
}
function mouseOverMachine(ev) {
  mousedOverMachine = ev.currentTarget;
}

function updateMachineGraphics() {
  clearMachines();
  calculateIncomeAndExpenses();
  calculateCore();
  renderIncomeAndExpenses();
  for (let i = 0; i < machines.length; i++) {
    renderAllRaces(machines[i]);
  }
}

function renderAllRaces(machine) {
  const crewField = machine.crewField;
  crewField.innerHTML = "";
  if (machine.crew == null || machine.crew.length != races.length) {
    machine.crew = [];
    for (let i = 0; i < races.length; i++) {
      machine.crew.push(0);
    }
  }
  for (let i = 0; i < races.length; i++) {
    if (machine.crew[i] == 0) {
      continue;
    }
    const crewImg = generateCrewBlock(i, machine.crew[i], machine.index);
    crewField.appendChild(crewImg);
  }
}

function clearMachines() {
  for (let i = 0; i < machines.length; i++) {
    machines[i].income = [];
    machines[i].expenses = [];
    if (machines[i].incomeDiv != null) {
      machines[i].incomeDiv.innerHTML = "";
    }
    if (machines[i].expensesDiv != null) {
      machines[i].expensesDiv.innerHTML = "";
    }
  }
}

function calculateIncomeAndExpenses() {
  //clearMachines() has been called before this function
  for (let i = 0; i < machines.length; i++) {
    const machine = machines[i];
    let productivity = 0;
    let crew = 0;
    for (let i = 0; i < machine.crew.length; i++) {
      let crewCount = machine.crew[i];
      let raceBonus = 0;
      if (machine.bonusesUsed != null) {
        machine.bonusesUsed.forEach((bonus) => {
          if (races[i][bonus] != null) {
            raceBonus += races[i][bonus];
          }
        });
      }
      productivity += crewCount * (2 + raceBonus);
      crew += crewCount;
    }
    if (machine.producePerProd != null) {
      machine.producePerProd.forEach((element) => {
        if (productivity <= 0) {
          return;
        }
        const resourceId = Object.keys(element)[0];
        const resourceAmmount = Object.values(element)[0] * productivity;
        machines[i].income[resourceId] =
          (machines[i].income[resourceId] || 0) + resourceAmmount;
      });
    }
    if (machine.expensesPerPop != null) {
      console.log("Calculating expenses for", machine.name, crew);
      machine.expensesPerPop.forEach((element) => {
        if (crew <= 0) {
          return;
        }
        const resourceId = Object.keys(element)[0];
        const resourceAmmount = Object.values(element)[0] * crew;
        machines[i].expenses[resourceId] =
          (machines[i].expenses[resourceId] || 0) + resourceAmmount;
        console.log("Expense", resourceId, resourceAmmount);
      });
    }
  }
}

function renderIncomeAndExpenses() {
  for (let i = 0; i < machines.length; i++) {
    const machine = machines[i];
    let incomeOutput = "";
    for (const resourceId in machine.income) {
      if (
        machine.income[resourceId] == null ||
        machine.income[resourceId] <= 0
      ) {
        continue;
      }
      incomeOutput +=
        (incomeOutput.length > 0 ? ", " : "") +
        machine.income[resourceId] +
        " " +
        getObjectById(resources, resourceId).name;
      machine.incomeDiv.appendChild(
        generateResourceBlock(
          resourceId,
          Math.floor(machine.income[resourceId])
        )
      );
    }
    machine.incomeDiv.innerHTML +=
      (incomeOutput.length > 0 ? "Income: " : "") + incomeOutput;
    let expensesOutput = "";
    for (const resourceId in machine.expenses) {
      if (
        machine.expenses[resourceId] == null ||
        machine.expenses[resourceId] <= 0
      ) {
        continue;
      }
      console.log(resourceId);
      expensesOutput +=
        (expensesOutput.length > 0 ? ", " : "") +
        machine.expenses[resourceId] +
        " " +
        getObjectById(resources, resourceId).name;
      machine.expensesDiv.appendChild(
        generateResourceBlock(
          resourceId,
          Math.floor(machine.expenses[resourceId])
        )
      );
    }
  }
}

// Render machines
function renderMachines() {
  const machinesDiv = document.getElementById("machines");
  machinesDiv.innerHTML = "";
  machines.forEach((machine) => {
    const div = document.createElement("div");
    machine.div = div;
    div.className = "machine";
    div.dataset.index = machine.index;

    const header = document.createElement("h4");
    header.textContent = machine.name;
    div.appendChild(header);

    const wrapper = document.createElement("div");
    wrapper.className = "machine-info-wrapper";
    div.appendChild(wrapper);

    const expenses = document.createElement("div");
    expenses.className = "expenses";
    expenses.textContent = "Expenses";
    wrapper.appendChild(expenses);
    machine.expensesDiv = expenses;

    const income = document.createElement("div");

    income.className = "income";
    wrapper.appendChild(income);
    machine.incomeDiv = income;

    const crewField = document.createElement("div");
    machine.crewField = crewField;
    crewField.className = "crew-field";
    wrapper.appendChild(crewField);
    renderAllRaces(machine);
    machinesDiv.appendChild(div);

    div.addEventListener("dragover", mouseOverMachine);
  });
  updateMachineGraphics();
}

function calculateCore() {
  const population = [];
  for (let i = 0; i < machines.length; i++) {
    for (let j = 0; j < machines[i].crew.length; j++) {
      population[j] = (population[j] || 0) + machines[i].crew[j];
    }
  }
  if (dragData != null) {
    population[dragData.race] += dragData.count;
  }
  // Calculate income from population
  for (let i = 0; i < population.length; i++) {
    if (races[i].production != null) {
      races[i].production.forEach((element) => {
        const resource = getResourceById(Object.keys(element)[0]);
        const ammount = Object.values(element)[0] * population[i];
        machines[0].income[resource.id] =
          (machines[0].income[resource.id] || 0) + ammount;
      });
    }
  }
}

function generateCrewBlock(race, count = 1, machine = -1) {
  const svgContainer = document.createElement("div");
  svgContainer.className = "imgHolder";
  const svgText = races[race].img;
  for (let i = 0; i < count; i++) {
    const innerSvgContainer = document.createElement("div");
    innerSvgContainer.className = "innerImgHolder";
    innerSvgContainer.innerHTML = svgText;
    innerSvgContainer.dataset.index = i;
    innerSvgContainer.dataset.race = race;
    innerSvgContainer.dataset.machine = machine;
    innerSvgContainer.addEventListener("mouseenter", mouseOverCrew);
    svgContainer.appendChild(innerSvgContainer);
  }
  svgContainer.draggable = true;
  svgContainer.addEventListener("dragstart", dragCrewStartHandler);
  svgContainer.addEventListener("dragend", dragCrewEndHandler);
  return svgContainer;
}
function generateResourceBlock(resource, count = 1) {
  const svgContainer = document.createElement("div");
  svgContainer.className = "imgHolder";
  const svgText = getResourceById(resource).img;
  for (let i = 0; i < Math.floor(count / 10); i++) {
    const innerSvgContainer = document.createElement("div");
    innerSvgContainer.className = "innerImgHolder";
    innerSvgContainer.innerHTML = svgText;
    svgContainer.appendChild(innerSvgContainer);
  }
  if (count % 10 != 0) {
    const smallSvgContainer = document.createElement("div");
    smallSvgContainer.className = "innerImgHolder";
    svgContainer.appendChild(smallSvgContainer);
    for (let i = 0; i < count % 10; i++) {
      const innerSvgContainer = document.createElement("div");
      innerSvgContainer.className = "smallImgHolder";
      innerSvgContainer.innerHTML = svgText;
      smallSvgContainer.appendChild(innerSvgContainer);
      if (i == 2 || i == 5) {
        smallSvgContainer.appendChild(document.createElement("br"));
      }
    }
  }
  return svgContainer;
}

function getResourceById(id) {
  return resources.find((r) => r.id == id);
}

function preloadImages(objectArray) {
  startAsync(objectArray.length);
  for (let i = 0; i < objectArray.length; i++) {
    fetch("../icons/ffffff/transparent/1x1/" + objectArray[i].imgSrc)
      .then((r) => r.text())
      .then((text) => {
        objectArray[i].img = text.replace("#fff", objectArray[i].color);

        endAsync();
      });
  }
}

function indexObjects(objectArray) {
  for (let i = 0; i < objectArray.length; i++) {
    objectArray[i].index = i;
  }
}

// Initial render
window.onload = function () {
  indexObjects(races);
  indexObjects(resources);
  indexObjects(machines);
  preloadImages(races);
  preloadImages(resources);
};

let asyncsStarted = 0;
function startAsync(count = 1) {
  asyncsStarted += count;
}
function endAsync() {
  asyncsStarted--;
  if (asyncsStarted <= 0) {
    renderMachines();
  }
}
function getObjectById(objectArray, id) {
  return objectArray.find((r) => r.id == id);
}
