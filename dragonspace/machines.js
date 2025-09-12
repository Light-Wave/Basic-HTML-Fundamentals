const races = [
  {
    name: "Human",
    img: "",
    imgSrc: "delapouite/person.svg",
    color: "beige",
    consumption: [{ wheat: 1 }],
    production: [{ money: 1 }],
  },
  {
    name: "Dwarf",
    img: "",
    imgSrc: "kier-heyl/dwarf-helmet.svg",
    color: "gold",
    metalworkingBonus: 1,
    farmingBonus: -0.5,
    consumption: [{ wheat: 1 }],
    production: [{ money: 1 }],
  },
  {
    name: "Elf",
    img: "",
    imgSrc: "kier-heyl/elf-helmet.svg",
    color: "green",
    metalworkingBonus: -0.5,
    farmingBonus: 1,
    consumption: [{ wheat: 1 }],
    production: [{ money: 1 }],
  },
];
const resources = [
  {
    id: "wheat",
    name: "Wheat",
    img: "",
    imgSrc: "lorc/wheat.svg",
    color: "wheat",
  },
  {
    id: "ore_iron",
    name: "Iron Ore",
    img: "",
    imgSrc: "faithtoken/ore.svg",
    color: "rgb(204, 148, 130)",
  },
  {
    id: "ore_copper",
    name: "Copper Ore",
    img: "",
    imgSrc: "faithtoken/ore.svg",
    color: "rgb(31, 128, 129)",
  },
  {
    id: "ore_tin",
    name: "Tin Ore",
    img: "",
    imgSrc: "faithtoken/ore.svg",
    color: "rgb(179, 179, 179)",
  },
  {
    id: "money",
    name: "Gold Coins",
    img: "",
    imgSrc: "lorc/crown-coin.svg",
    color: "gold",
  },
];

const machines = [
  { name: "Idle", crew: [6, 0, 0] },
  {
    name: "Iron Mine",
    crew: [2, 3, 3],
    bonusesUsed: ["metalworkingBonus"],
    produce: [{ ore_iron: 1 }],
  },
  {
    name: "Copper Mine",
    crew: [0, 3, 0],
    bonusesUsed: ["metalworkingBonus"],
    produce: [{ ore_copper: 1 }],
  },
  {
    name: "Farming",
    crew: [0, 0, 3],
    bonusesUsed: ["farmingBonus"],
    produce: [{ wheat: 1 }],
  },
  {
    name: "Tin Flowers",
    crew: [0, 0, 1],
    bonusesUsed: ["farmingBonus", "metalworkingBonus"],
    produce: [{ wheat: 1 }, { ore_tin: 1 }],
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
    renderMachines();
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
  renderMachines();
}

function mouseOverCrew(ev) {
  mousedOverCrew = ev.target;
}
function mouseOverMachine(ev) {
  mousedOverMachine = ev.currentTarget;
}

function renderAllRaces(machine) {
  const crewField = machine.crewField;
  if (machine.crew == null || machine.crew.length != races.length) {
    machine.crew = [0, 0, 0];
  }
  for (let i = 0; i < races.length; i++) {
    if (machine.crew[i] == 0) {
      continue;
    }
    const crewImg = generateCrewBlock(i, machine.crew[i], machine.index);
    crewField.appendChild(crewImg);
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

    const income = document.createElement("div");
    let productivity = 0;
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
    }
    let output = "";
    if (machine.produce != null) {
      machine.produce.forEach((element) => {
        if (productivity <= 0) {
          return;
        }
        output +=
          (output.length > 0 ? ", " : "") +
          Object.values(element)[0] * productivity +
          " " +
          resources.find((r) => r.id == Object.keys(element)[0]).name;
        income.appendChild(
          generateResourceBlock(
            Object.keys(element)[0],
            Math.floor(Object.values(element)[0] * productivity)
          )
        );
      });
    }
    income.className = "income";
    //income.textContent = "Income: " + output;
    wrapper.appendChild(income);
    income.innerHTML += "Income: " + output;
    machine.incomeDiv = income;

    const crewField = document.createElement("div");
    machine.crewField = crewField;
    crewField.className = "crew-field";
    wrapper.appendChild(crewField);
    renderAllRaces(machine);
    machinesDiv.appendChild(div);

    div.addEventListener("dragover", mouseOverMachine);
  });
  renderCore();
}

function renderCore() {
  machines[0].incomeDiv.innerHTML = "";
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
  const popIncome = new Map();
  for (let i = 0; i < population.length; i++) {
    if (races[i].production != null) {
      races[i].production.forEach((element) => {
        const resource = getResourceById(Object.keys(element)[0]);
        popIncome.set(
          resource.id,
          (popIncome.get(resource.id) || 0) +
            Object.values(element)[0] * population[i]
        );
      });
    }
  }
  console.log(popIncome);

  let output = "";
  popIncome.forEach((value, key) => {
    if (value == null || value <= 0) {
      return;
    }
    console.log(key, value);
    output +=
      (output.length > 0 ? ", " : "") +
      value +
      " " +
      getObjectById(resources, key).name;
    machines[0].incomeDiv.appendChild(
      generateResourceBlock(key, Math.floor(value))
    );
  });
  machines[0].incomeDiv.innerHTML += "Income: " + output;
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
