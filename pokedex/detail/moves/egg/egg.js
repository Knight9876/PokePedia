import rgbaColors from "../../../../utils/rgbaColors.js";

const eggMovesContainer = document.getElementById("moves");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const infoDiv = document.querySelector(".info-div")


const storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor")


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


async function fetchPokemonEggMoves(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();
    const eggMoves = data.moves.filter((move) =>
      move.version_group_details.some(
        (detail) => detail.move_learn_method.name === "egg"
      )
    );

    return eggMoves.map((move) => {
      const moveNumber = move.move.url.split("/").slice(-2, -1)[0]; 
      return {
        name: move.move.name,
        moveNumber,
      };
    });
  } catch (error) {
    console.error("Error fetching Pokémon egg moves:", error);
    return [];
  }
}


async function displayEggMoves(pokemonName) {
  
  for (let fa of faSolid) {
    fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
  }

  const eggMoves = await fetchPokemonEggMoves(pokemonName);

  const eggMovesHtml = eggMoves
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

  eggMovesHtml
    ? (eggMovesContainer.innerHTML = eggMovesHtml)
    : (eggMovesContainer.innerHTML = "This POKÉMON cannot be hatched.");
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
  () => (window.location.href = "../pokedex.html")
);

eggMovesContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let pokemonMoveNameOrID = event.target.innerHTML;
    pokemonMoveNameOrID = pokemonMoveNameOrID.includes("Mv.")
      ? pokemonMoveNameOrID.split(" ")[1]
      : pokemonMoveNameOrID.split(" ").join("-");
    sessionStorage.setItem("pokemonMoveNameOrId", pokemonMoveNameOrID);
    window.location.href = "../moveDetails/moveDetails.html";
  }
});

(async () => {
  showLoader(); 
  if (storedPokemonName) {
    await displayEggMoves(storedPokemonName);
    hideLoader(); 
  } else {
    hideLoader(); 
  }
})();
