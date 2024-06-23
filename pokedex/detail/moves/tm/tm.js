import rgbaColors from "../../../../utils/rgbaColors.js";
import rgbaColorsForScrollbar from "../../../../utils/rgbaColorsForScrollbar.js";

const tmMovesContainer = document.getElementById("moves");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");


const storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");


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


async function fetchAllMachines() {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/machine?limit=2102"
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching machines:", error);
    return [];
  }
}


async function fetchPokemonTmMoves(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();
    const tmMoves = data.moves.filter((move) =>
      move.version_group_details.some(
        (detail) => detail.move_learn_method.name === "machine"
      )
    );

    const hmMoves = [
      "cut",
      "fly",
      "surf",
      "strength",
      "flash",
      "rock-smash",
      "waterfall",
      "dive",
      "defog",
      "rock-climb"
    ];

    return tmMoves
      .filter((move) => !hmMoves.includes(move.move.name)) 
      .map((move) => ({
        name: move.move.name,
        url: move.move.url,
      }));
  } catch (error) {
    console.error("Error fetching Pokémon TM moves:", error);
    return [];
  }
}


async function fetchTmNumbers(tmMoves, allMachines) {
  const tmNumbers = [];

  for (const move of tmMoves) {
    const moveResponse = await fetch(move.url);
    const moveData = await moveResponse.json();
    const machine = moveData.machines.find((machine) => {
      return allMachines.some(
        (machineItem) => machineItem.url === machine.machine.url
      );
    });

    if (machine) {
      const tmNumber = machine.machine.url.split("/").slice(-2, -1)[0];
      tmNumbers.push({
        name: move.name,
        tmNumber: parseInt(tmNumber, 10), 
      });
    }
  }

  return tmNumbers.sort((a, b) => a.tmNumber - b.tmNumber); 
}


async function displayTmMoves(pokemonName) {
  for (let fa of faSolid) {
    fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
  }

  tmMovesContainer.style.setProperty(
    "--scrollbar-thumb-color",
    storedPkmnColor
  );
  tmMovesContainer.style.setProperty(
    "--scrollbar-track-color",
    rgbaColorsForScrollbar[storedPkmnColor]
  );
  

  const allMachines = await fetchAllMachines();
  const tmMoves = await fetchPokemonTmMoves(pokemonName);
  const tmMovesWithNumbers = await fetchTmNumbers(tmMoves, allMachines);

  const tmMovesHtml = tmMovesWithNumbers
    .map((move) =>
      storedPkmnColor === "white"
        ? `
      <div class="move-container" style="border: 0.3rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor}; background: ${
            rgbaColors[storedPkmnColor]
          };">
        <p class="move-number" style="text-shadow: 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor};">TM ${
            move.tmNumber
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
        <p class="move-number" style="text-shadow: 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor};">TM ${
            move.tmNumber
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
        <p class="move-number" style="text-shadow: 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor}, 0px 0px 5px ${storedPkmnColor};">TM ${
            move.tmNumber
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

  tmMovesHtml
    ? (tmMovesContainer.innerHTML = tmMovesHtml)
    : (tmMovesContainer.innerHTML = "This POKÉMON cannot learn TM moves.");
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

tmMovesContainer.addEventListener("click", (event) => {
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
    await displayTmMoves(storedPokemonName);
    hideLoader(); 
  } else {
    hideLoader(); 
  }
})();
