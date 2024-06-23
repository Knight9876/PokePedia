import rgbaColors from "../../../utils/rgbaColors.js";

const storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");

const mainContainer = document.querySelector(".main-container");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const abilitiesContainer = document.querySelector(".abilities");
const loader = document.getElementById("loader");
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

async function fetchAbilities() {
  showLoader();
  try {
    const data = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${storedPokemonName}`
    );
    const abilities = await data.json();
    const abilitiesData = abilities.abilities.map((ability) => {
      return {
        name: ability.ability.name.split("-").join(" "),
        id: ability.ability.url.split("/")[6],
      };
    });

    if (abilitiesData.length === 0) {
      abilitiesContainer.innerHTML =
        "<p>This POKÉMON cannot be found or encountered.</p>";
    } else {
      abilitiesData.forEach((ability) => {
        if (storedPkmnColor === "white") {
          abilitiesContainer.innerHTML += `
        <div class="abilities-container" style="border: 0.3rem ridge ${storedPkmnColor}; text-shadow: 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}; box-shadow: 0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}; background: ${
            rgbaColors[storedPkmnColor]
          }">
          <p class="ability-id">Ab. ${ability.id}</p>
          <p class="ability-name">${ability.name.split("-").join(" ")}</p>
        </div>
      `;
        } else if (storedPkmnColor === "yellow") {
          abilitiesContainer.innerHTML += `
        <div class="abilities-container" style="border: 0.3rem ridge ${storedPkmnColor}; text-shadow: 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}; box-shadow: 0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}; background: ${
            rgbaColors[storedPkmnColor]
          }">
          <p class="ability-id">Ab. ${ability.id}</p>
          <p class="ability-name">${ability.name.split("-").join(" ")}</p>
        </div>
      `;
        } else {
          abilitiesContainer.innerHTML += `
        <div class="abilities-container" style="border: 0.3rem ridge ${storedPkmnColor}; text-shadow: 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}; box-shadow: 0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}; background: ${
            rgbaColors[storedPkmnColor]
          }">
          <p class="ability-id">Ab. ${ability.id}</p>
          <p class="ability-name">${ability.name.split("-").join(" ")}</p>
        </div>
      `;
        }
      });
    }
    hideLoader();
  } catch (error) {
    console.error(error);
    hideLoader();
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

backbtn.addEventListener(
  "click",
  () => (window.location.href = "../detail.html")
);

abilitiesContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let pokemonAbilityNameOrID = event.target.innerHTML;
    pokemonAbilityNameOrID = pokemonAbilityNameOrID.includes("Ab.")
      ? pokemonAbilityNameOrID.split(" ")[1]
      : pokemonAbilityNameOrID.split(" ").join("-");
    sessionStorage.setItem("pokemonAbilityName", pokemonAbilityNameOrID);
    window.location.href = "abilityDetails/abilityDetails.html";
  }
});

fetchAbilities();
