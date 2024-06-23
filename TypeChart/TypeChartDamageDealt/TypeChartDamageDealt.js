import damageDealt from "../../utils/damageDealt.js";

const tableContainer = document.getElementById("table");
const mainContainer = document.querySelector(".main-container");
const loader = document.getElementById("loader");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const backbtn = document.querySelector(".back");

function generateTable(data) {
  mainContainer.style.visibility = "hidden";
  loader.style.visibility = "visible";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  
  const headerRow = document.createElement("tr");
  const headerCell = document.createElement("th");
  headerCell.textContent = "Type";
  headerRow.appendChild(headerCell);

  const types = Object.keys(data);
  types.forEach((type) => {
    const th = document.createElement("th");
    th.textContent = type
    th.style.background = getTypeBackgroundColorForType(th.textContent)
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  
  types.forEach((type) => {
    const row = document.createElement("tr");
    const typeCell = document.createElement("td");
    typeCell.textContent = type
    typeCell.style.background = getTypeBackgroundColorForType(typeCell.textContent)
    row.appendChild(typeCell);

    types.forEach((innerType) => {
      const cell = document.createElement("td");
      cell.textContent = data[type][innerType];
      cell.style.background = getTypeBackgroundColorForEffectiveness(cell.textContent);
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  mainContainer.style.visibility = "visible";
  loader.style.visibility = "hidden";
  return table;
}

function getTypeBackgroundColorForType(type) {
    return type === "normal"
      ? "grey"
      : type === "fighting"
      ? "red"
      : type === "flying"
      ? "rgb(0, 183, 255)"
      : type === "poison"
      ? "purple"
      : type === "ground"
      ? "#a0522d"
      : type === "rock"
      ? "#8b0000"
      : type === "bug"
      ? "yellowgreen"
      : type === "ghost"
      ? "rgb(49, 0, 72)"
      : type === "steel"
      ? "rgb(93, 93, 93)"
      : type === "fire"
      ? "rgb(255, 98, 0)"
      : type === "water"
      ? "blue"
      : type === "grass"
      ? "green"
      : type === "electric"
      ? "yellow"
      : type === "psychic"
      ? "rgb(255, 0, 132)"
      : type === "ice"
      ? "cyan"
      : type === "dragon"
      ? "rgb(100, 0, 171)"
      : type === "dark"
      ? "black"
      : type === "fairy"
      ? "hotpink"
      : "white"; 
  }

  
function getTypeBackgroundColorForEffectiveness(effectiveness) {
    return effectiveness === "0"
      ? "black"
      : effectiveness === "0.25"
      ? "skyblue"
      : effectiveness === "0.5"
      ? "cyan"
      : effectiveness === "1"
      ? "blue"
      : effectiveness === "2"
      ? "lime"
      : "red";
  }

  openMenu.addEventListener("click", () => {
    menuList.classList.toggle("show");
    openMenu.style.visibility = "hidden";
    closeMenu.style.visibility = "visible";
  });
  
  closeMenu.addEventListener("click", () => {
    menuList.classList.toggle("show");
    openMenu.style.visibility = "visible";
    closeMenu.style.visibility = "hidden";
  });
  
  backbtn.addEventListener("click", () => (window.location.href = "../TypeChart.html"));

const table = generateTable(damageDealt);
tableContainer.appendChild(table);
