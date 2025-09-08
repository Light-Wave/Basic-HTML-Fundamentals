const races = [
  {
    name: "Human",
    img: "delapouite/person.svg",
    color: "beige",
  },
  {
    name: "Dwarf",
    img: "kier-heyl/dwarf-helmet.svg",
    color: "gold",
  },
  {
    name: "Elf",
    img: "kier-heyl/elf-helmet.svg",
    color: "green",
  },
];

const machines = [
  { id: 0, name: "Idle", crew: [6, 0, 0] },
  { id: 1, name: "Iron Mine", crew: [0, 3, 0] },
  { id: 2, name: "Copper Mine", crew: [0, 3, 0] },
  { id: 3, name: "Farming", crew: [0, 0, 3] },
];
let mousedOverCrew = -1;

// Render crew members
function renderCrew() {
  const crewDiv = document.getElementById("crew");
  crewDiv.innerHTML = "";
  crewMembers.forEach((member) => {
    const div = document.createElement("div");
    div.textContent = member.name;
    div.draggable = true;
    div.className = "crew-member";
    div.dataset.id = member.id;
    div.addEventListener("dragstart", dragstartHandler);
    crewDiv.appendChild(div);
  });
}

function dragstartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.dataset.id);
  console.log("Dragging crew ID:", mousedOverCrew);
}
function mouseOverCrew(ev) {
  mousedOverCrew = ev.target.dataset.index;
  console.log("Mouse over crew index:", mousedOverCrew);
}

// Render machines
function renderMachines() {
  const machinesDiv = document.getElementById("machines");
  machinesDiv.innerHTML = "";
  machines.forEach((machine) => {
    const div = document.createElement("div");
    div.className = "machine";
    div.dataset.id = machine.id;
    const header = document.createElement("h4");
    header.textContent = machine.name;
    div.appendChild(header);
    const crewField = document.createElement("div");
    crewField.className = "crew-field";
    crewField.innerHTML = "&nbsp;";
    div.appendChild(crewField);
    if (machine.crew == null || machine.crew.length != races.length) {
      machine.crew = [0, 0, 0];
    }
    for (let i = 0; i < races.length; i++) {
      if (machine.crew[i] == 0) {
        continue;
      }
      const crewImg = generateCrewImage(
        races[i].img,
        races[i].color,
        machine.crew[i]
      );
      crewField.appendChild(crewImg);
    }
    /*
    div.addEventListener("dragover", (e) => e.preventDefault());
    div.addEventListener("drop", (e) => {
      e.preventDefault();
      const crewId = parseInt(e.dataTransfer.getData("text/plain"));
      const crew = crewMembers.find((c) => c.id === crewId);
      machine.crew = crew;
      renderMachines();
    });*/
    machinesDiv.appendChild(div);
  });
}
function generateCrewImage(svgUrl, color, count = 1) {
  const svgContainer = document.createElement("div");
  svgContainer.className = "imgHolder";
  fetch("../icons/ffffff/transparent/1x1/" + svgUrl)
    .then((r) => r.text())
    .then((text) => {
      const svgText = text.replace("#fff", color);
      for (let i = 0; i < count; i++) {
        const innerSvgContainer = document.createElement("div");
        innerSvgContainer.className = "innerImgHolder";
        innerSvgContainer.innerHTML = svgText;
        innerSvgContainer.dataset.index = i;
        innerSvgContainer.addEventListener("mouseenter", mouseOverCrew);
        svgContainer.appendChild(innerSvgContainer);
        console.log("Added crew with id: " + innerSvgContainer.dataset.index);
      }
    });
  svgContainer.draggable = true;
  svgContainer.addEventListener("dragstart", dragstartHandler);
  return svgContainer;
}

// Initial render
window.onload = function () {
  /*document.body.innerHTML = `
        <h2>Crew Members</h2>
        <div id="crew" style="display:flex; gap:10px; margin-bottom:20px;"></div>
        <h2>Machines</h2>
        <div id="machines" style="display:flex; gap:10px;"></div>
        <style>
            .crew-member { padding:8px; background:#eef; border:1px solid #99f; border-radius:4px; cursor:grab; }
            .machine { padding:16px; background:#efe; border:1px solid #9f9; border-radius:4px; min-width:120px; min-height:40px; }
        </style>
    `;
  renderCrew();*/
  renderMachines();
};
