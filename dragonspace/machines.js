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
  },
  {
    name: "Elf",
    img: "",
    imgSrc: "kier-heyl/elf-helmet.svg",
    color: "green",
  },
];

const machines = [
  { id: 0, name: "Idle", crew: [6, 0, 0] },
  { id: 1, name: "Iron Mine", crew: [2, 3, 3] },
  { id: 2, name: "Copper Mine", crew: [0, 3, 0] },
  { id: 3, name: "Farming", crew: [0, 0, 3] },
];
let mousedOverCrew = -1;
let mousedOverMachine = -1;
let dragData = null;

function dragCrewStartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.dataset.id);
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
    machines[mousedOverMachine.dataset.id].crew[dragData.race] +=
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
  crewField.innerHTML = "&nbsp;";
  if (machine.crew == null || machine.crew.length != races.length) {
    machine.crew = [0, 0, 0];
  }
  for (let i = 0; i < races.length; i++) {
    if (machine.crew[i] == 0) {
      continue;
    }
    const crewImg = generateCrewBlock(i, machine.crew[i], machine.id);
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
    div.dataset.id = machine.id;
    const header = document.createElement("h4");
    header.textContent = machine.name;
    div.appendChild(header);
    const crewField = document.createElement("div");
    machine.crewField = crewField;
    crewField.className = "crew-field";
    crewField.innerHTML = "&nbsp;";
    div.appendChild(crewField);
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

function preloadImages() {
  console.log("Preloading images...");
  for (let i = 0; i < races.length; i++) {
    fetch("../icons/ffffff/transparent/1x1/" + races[i].imgSrc)
      .then((r) => r.text())
      .then((text) => {
        races[i].img = text.replace("#fff", races[i].color);
        console.log(`Preloaded image for ${races[i].name}`);

        renderMachines();
      });
  }
  console.log("All images preloaded.");
}

// Initial render
window.onload = function () {
  preloadImages();
};
