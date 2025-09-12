const races = [
  {
    name: "Human",
    img: "",
    imgSrc: "delapouite/person.svg",
    color: "beige",
  },
  {
    name: "Dwarf",
    img: "",
    imgSrc: "kier-heyl/dwarf-helmet.svg",
    color: "gold",
    metalworkingBonus: 1,
    farmingBonus: -0.5,
  },
  {
    name: "Elf",
    img: "",
    imgSrc: "kier-heyl/elf-helmet.svg",
    color: "green",
    metalworkingBonus: -0.5,
    farmingBonus: 1,
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
];

const machines = [
  { name: "Idle", crew: [6, 0, 0] },
  {
    name: "Iron Mine",
    crew: [2, 3, 3],
    bonusesUsed: ["metalworkingBonus"],
  },
  {
    name: "Copper Mine",
    crew: [0, 3, 0],
    bonusesUsed: ["metalworkingBonus"],
  },
  {
    name: "Farming",
    crew: [0, 0, 3],
    bonusesUsed: ["farmingBonus"],
    produce: [{ wheat: 2 }, { ore_iron: 1 }],
  },
  {
    name: "Tin Flowers",
    crew: [0, 0, 1],
    bonusesUsed: ["farmingBonus", "metalworkingBonus"],
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
  console.log(dragedCrews);
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
  renderMachines();
  dragData = null;
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
  console.log("Rendering machines...");
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
        output +=
          (output.length > 0 ? ", " : "") +
          Object.values(element)[0] * productivity +
          " " +
          resources.find((r) => r.id == Object.keys(element)[0]).name;
      });
    }
    income.className = "income";
    income.textContent = "Income: " + output;
    wrapper.appendChild(income);

    const crewField = document.createElement("div");
    machine.crewField = crewField;
    crewField.className = "crew-field";
    wrapper.appendChild(crewField);
    renderAllRaces(machine);
    machinesDiv.appendChild(div);

    div.addEventListener("dragover", mouseOverMachine);
  });
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

function preloadImages(objectArray) {
  console.log("Preloading images...");
  startAsync(objectArray.length);
  for (let i = 0; i < objectArray.length; i++) {
    fetch("../icons/ffffff/transparent/1x1/" + objectArray[i].imgSrc)
      .then((r) => r.text())
      .then((text) => {
        objectArray[i].img = text.replace("#fff", objectArray[i].color);
        console.log(`Preloaded image for ${objectArray[i].name}`);

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
