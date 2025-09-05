const crewMembers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const machines = [
  { id: 1, name: "Engine", crew: null },
  { id: 2, name: "Shield", crew: null },
];

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
    div.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", member.id);
    });
    crewDiv.appendChild(div);
  });
}

function dragstartHandler(ev) {
  ev.dataTransfer.setDragImage(img, 10, 10);
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

// Render machines
function renderMachines() {
  const machinesDiv = document.getElementById("machines");
  machinesDiv.innerHTML = "";
  machines.forEach((machine) => {
    const div = document.createElement("div");
    div.className = "machine";
    div.dataset.id = machine.id;
    div.textContent =
      machine.name + " - " + (machine.crew ? machine.crew.name : "Unassigned");
    div.addEventListener("dragover", (e) => e.preventDefault());
    div.addEventListener("drop", (e) => {
      e.preventDefault();
      const crewId = parseInt(e.dataTransfer.getData("text/plain"));
      const crew = crewMembers.find((c) => c.id === crewId);
      machine.crew = crew;
      renderMachines();
    });
    machinesDiv.appendChild(div);
  });
}

// Initial render
window.onload = function () {
  document.body.innerHTML = `
        <h2>Crew Members</h2>
        <div id="crew" style="display:flex; gap:10px; margin-bottom:20px;"></div>
        <h2>Machines</h2>
        <div id="machines" style="display:flex; gap:10px;"></div>
        <style>
            .crew-member { padding:8px; background:#eef; border:1px solid #99f; border-radius:4px; cursor:grab; }
            .machine { padding:16px; background:#efe; border:1px solid #9f9; border-radius:4px; min-width:120px; min-height:40px; }
        </style>
    `;
  renderCrew();
  renderMachines();
};
