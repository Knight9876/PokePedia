import rgbaColors from "../../../../utils/rgbaColors.js";
import rgbaColorsForScrollbar from "../../../../utils/rgbaColorsForScrollbar.js";

const storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");

const hmMovesContainer = document.getElementById("moves");
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

async function fetchPokemonMachineMoves(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();
    const machineMoves = data.moves.filter((move) =>
      move.version_group_details.some(
        (detail) => detail.move_learn_method.name === "machine"
      )
    );

    const hmMovesName = [
      "cut",
      "fly",
      "surf",
      "strength",
      "flash",
      "rock-smash",
      "waterfall",
      "dive",
    ];

    const machineData = machineMoves
      .filter((move) => hmMovesName.includes(move.move.name))
      .map((move) => move.move.name);
    const number = [];
    for (let i = 0; i < machineData.length; i++) {
      number.push(hmMovesName.findIndex((move) => move === machineData[i]) + 1);
    }
    return [machineData, number];
  } catch (error) {
    console.error("Error fetching Pokémon TM moves:", error);
    return [];
  }
}

async function displayHmMoves(pokemonName) {
  for (let fa of faSolid) {
    fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
  }

  hmMovesContainer.style.setProperty(
    "--scrollbar-thumb-color",
    storedPkmnColor
  );
  hmMovesContainer.style.setProperty(
    "--scrollbar-track-color",
    rgbaColorsForScrollbar[storedPkmnColor]
  );

  const [machineMoves, id] = await fetchPokemonMachineMoves(pokemonName);

  let hmMovesHtml = "";

  for (let i = 0; i < machineMoves.length; i++) {
    if (storedPkmnColor === "white") {
      hmMovesHtml += `
        <div class="move-container" style="border: 0.3rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor}; background: ${
        rgbaColors[storedPkmnColor]
      };">
          <p class="move-number" style="text-shadow: 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor};">HM 0${
        id[i]
      }</p>
          <p class="move-name" style="text-shadow: 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor};">${
        machineMoves[i].includes("-o-")
          ? machineMoves[i]
          : machineMoves[i].split("-").join(" ")
      }</p>
        </div>
      `;
    } else if (storedPkmnColor === "yellow") {
      hmMovesHtml += `
        <div class="move-container" style="border: 0.3rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor}; background: ${
        rgbaColors[storedPkmnColor]
      };">
          <p class="move-number" style="text-shadow: 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor};">HM 0${
        id[i]
      }</p>
          <p class="move-name" style="text-shadow: 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor};">${
        machineMoves[i].includes("-o-")
          ? machineMoves[i]
          : machineMoves[i].split("-").join(" ")
      }</p>
        </div>
      `;
    } else {
      hmMovesHtml += `
        <div class="move-container" style="border: 0.3rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor}; background: ${
        rgbaColors[storedPkmnColor]
      };">
          <p class="move-number" style="text-shadow: 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor};">HM 0${
        id[i]
      }</p>
          <p class="move-name" style="text-shadow: 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor};">${
        machineMoves[i].includes("-o-")
          ? machineMoves[i]
          : machineMoves[i].split("-").join(" ")
      }</p>
        </div>
      `;
    }
  }

  hmMovesHtml
    ? (hmMovesContainer.innerHTML = hmMovesHtml)
    : (hmMovesContainer.innerHTML = "This POKÉMON cannot learn TM moves.");
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

hmMovesContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let pokemonMoveNameOrID = event.target.innerHTML;
    pokemonMoveNameOrID = pokemonMoveNameOrID.includes("TM")
      ? " "
      : pokemonMoveNameOrID.split(" ").join("-");
    sessionStorage.setItem("pokemonMoveNameOrId", pokemonMoveNameOrID);
    window.location.href = "../moveDetails/moveDetails.html";
  }
});

(async () => {
  showLoader();

  if (storedPokemonName) {
    await displayHmMoves(storedPokemonName);
    hideLoader();
  } else {
    hideLoader();
  }
})();
