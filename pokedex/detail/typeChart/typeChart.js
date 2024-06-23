import rgbaColorsForScrollbar from "../../../utils/rgbaColorsForScrollbar.js"
import rgbaColors from "../../../utils/rgbaColors.js"
import damageDealt from "../../../utils/damageDealt.js"
import damageTaken from "../../../utils/damageTaken.js"

const storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor")

const type = document.querySelectorAll(".type")
const h1 = document.getElementsByTagName("h3")
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const faSolid = document.querySelectorAll(".fa-solid");
const pokemonName = document.getElementById("pokemon-name")

pokemonName.innerHTML += " " + storedPokemonName

for (const h of h1) {
  storedPkmnColor === "white" ?
  h.style.textShadow = `0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}` :
  storedPkmnColor === "yellow" ?
  h.style.textShadow = `0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}` :
  h.style.textShadow = `0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}`
}

for(const t of type) {
  t.style.backgroundColor = rgbaColorsForScrollbar[storedPkmnColor]
  t.style.boxShadow = `0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}`
  t.style.setProperty(
    "--scrollbar-thumb-color",
    storedPkmnColor
  );
}

for (let fa of faSolid) {
  fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
}

for (let btn of document.getElementsByTagName("button")) {
  btn.style.border = `0.3rem ridge ${
    storedPkmnColor === "black" ? "white" : storedPkmnColor
  }`;
  btn.style.background = rgbaColors[storedPkmnColor];
  btn.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
}

async function getPokemonTypes(pokemonName) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  const data = await response.json();
  return data.types.map((typeInfo) => typeInfo.type.name);
}

function combinedTypeDamageDealtOrTaken(types, damageObject) {
  const combinedDamageDealtOrTaken = {};
  for (const type in damageObject) {
    combinedDamageDealtOrTaken[type] = 1;
  }

  types.forEach((type) => {
    for (const targetType in damageObject[type]) {
      combinedDamageDealtOrTaken[targetType] *= damageObject[type][targetType];
    }
  });

  return combinedDamageDealtOrTaken;
}

async function displayPokemonTypeChart(pokemonName) {
  const types = await getPokemonTypes(pokemonName);
  const combinedDamageDealt = combinedTypeDamageDealtOrTaken(types, damageDealt);
  const damageDealtRow = document.getElementById("damage-dealt-row");

  
  for (const type in combinedDamageDealt) {
    const cell = document.createElement("td");
    cell.textContent = combinedDamageDealt[type];
    cell.textContent === "0"
      ? (cell.style.backgroundColor = "black")
      : cell.textContent === "0.25"
      ? (cell.style.backgroundColor = "skyblue")
      : cell.textContent === "0.5"
      ? (cell.style.backgroundColor = "cyan")
      : cell.textContent === "1"
      ? (cell.style.backgroundColor = "blue")
      : cell.textContent === "2"
      ? (cell.style.backgroundColor = "lime")
      : (cell.style.backgroundColor = "red");
    damageDealtRow.appendChild(cell);
  }
  const combinedDamageTaken = combinedTypeDamageDealtOrTaken(types, damageTaken);
  const damageTakenRow = document.getElementById("damage-taken-row");

  
  for (const type in combinedDamageTaken) {
    const cell = document.createElement("td");
    cell.textContent = combinedDamageTaken[type];
    cell.textContent === "0"
      ? (cell.style.backgroundColor = "black")
      : cell.textContent === "0.25"
      ? (cell.style.backgroundColor = "skyblue")
      : cell.textContent === "0.5"
      ? (cell.style.backgroundColor = "cyan")
      : cell.textContent === "1"
      ? (cell.style.backgroundColor = "blue")
      : cell.textContent === "2"
      ? (cell.style.backgroundColor = "lime")
      : (cell.style.backgroundColor = "red");
    damageTakenRow.appendChild(cell);
  }
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

document.querySelector(".back").addEventListener(
  "click",
  () => (window.location.href = "../detail.html")
);


displayPokemonTypeChart(storedPokemonName)
