import rgbaColors from "../../../../utils/rgbaColors.js";
import rgbaColorsForScrollbar from "../../../../utils/rgbaColorsForScrollbar.js";

const storedPokemonName = sessionStorage.getItem("pokemonName");
let storedPkmnColor = sessionStorage.getItem("pkmnColor");
storedPkmnColor ? storedPkmnColor : (storedPkmnColor = "white");

const allMovesContainer = document.getElementById("moves");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
menuList.style.border = `0.3rem ridge ${storedPkmnColor}`;
const closeMenu = document.getElementById("close-menu");

function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}

function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}

for (let btn of document.getElementsByTagName("button")) {
  btn.style.border = `0.3rem ridge ${
    storedPkmnColor === "black" ? "white" : storedPkmnColor
  }`;
  btn.style.background = rgbaColors[storedPkmnColor];
  btn.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
}

async function fetchPokemonData(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return null;
  }
}

async function fetchPokemonAllMoves(pokemonName) {
  try {
    const data = await fetchPokemonData(pokemonName);
    if (!data) return [];

    const allMoves = data.moves.map((move) => move.move);

    return allMoves.map((move) => {
      const moveNumber = move.url.split("/").slice(-2, -1)[0];
      return {
        name: move.name,
        moveNumber,
      };
    });
  } catch (error) {
    console.error("Error fetching Pokémon all moves:", error);
    return [];
  }
}

async function displayAllMoves(pokemonName) {
  for (let fa of faSolid) {
    fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
  }

  const allMoves = await fetchPokemonAllMoves(pokemonName);

  const allMovesHtml = allMoves
    .map((move) =>
      storedPkmnColor === "white"
        ? `
    <div class="move-container" style="border: 0.3rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor}; background: ${
            rgbaColors[storedPkmnColor]
          };">
      <p class="move-number" style="text-shadow: 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor};">Mv. ${
            move.moveNumber
          }</p>
      <p class="move-name" style="text-shadow: 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor};">${
            move.name.includes("-o-")
              ? move.name
              : move.name.split("-").join(" ")
          }</p>
    </div>
  `
        : storedPkmnColor === "yellow"
        ? `
    <div class="move-container" style="border: 0.3rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor}; background: ${
            rgbaColors[storedPkmnColor]
          };">
      <p class="move-number" style="text-shadow: 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor};">Mv. ${
            move.moveNumber
          }</p>
      <p class="move-name" style="text-shadow: 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor};">${
            move.name.includes("-o-")
              ? move.name
              : move.name.split("-").join(" ")
          }</p>
    </div>
  `
        : `
    <div class="move-container" style="border: 0.3rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor}; background: ${
            rgbaColors[storedPkmnColor]
          };">
      <p class="move-number" style="text-shadow: 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor};">Mv. ${
            move.moveNumber
          }</p>
      <p class="move-name" style="text-shadow: 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor};">${
            move.name.includes("-o-")
              ? move.name
              : move.name.split("-").join(" ")
          }</p>
    </div>
  `
    )
    .join("");

  allMovesContainer.innerHTML = allMovesHtml;
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

backbtn.addEventListener(
  "click",
  () => (window.location.href = "../moves.html")
);

allMovesContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let pokemonMoveNameOrID = event.target.innerHTML;
    pokemonMoveNameOrID = pokemonMoveNameOrID.includes("Mv.")
      ? pokemonMoveNameOrID.split(" ")[1]
      : pokemonMoveNameOrID.split(" ").join("-");
    sessionStorage.setItem("pokemonMoveNameOrId", pokemonMoveNameOrID);
    window.location.href = "../moveDetails/moveDetails.html";
  }
});

allMovesContainer.style.setProperty("--scrollbar-thumb-color", storedPkmnColor);
allMovesContainer.style.setProperty(
  "--scrollbar-track-color",
  rgbaColorsForScrollbar[storedPkmnColor]
);

(async () => {
  showLoader();

  if (storedPokemonName) {
    await displayAllMoves(storedPokemonName);
    hideLoader();
  } else {
    hideLoader();
  }
})();
