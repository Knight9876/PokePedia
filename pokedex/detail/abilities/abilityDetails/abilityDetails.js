import rgbaColors from "../../../../utils/rgbaColors.js";
import rgbaColorsForScrollbar from "../../../../utils/rgbaColorsForScrollbar.js";

const abilityDetailsContainer = document.getElementById("ability-details");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const h1 = document.getElementsByTagName("h1");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const pokemonList = document.getElementById("pokemon-list");
const abilityName = document.querySelector(".ability-name");

const storedPokemonAbilityName = sessionStorage.getItem("pokemonAbilityName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");

document.title +=
  "-" + storedPokemonAbilityName.toUpperCase().split("-").join(" ");

abilityName.innerHTML += storedPokemonAbilityName.split("-").join(" ");

for (let h of h1) {
  h.style.borderBottom = `0.3rem ridge ${storedPkmnColor}`;
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


function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}


function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}


async function fetchAbilityDetails(abilityName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/ability/${abilityName}`
    );
    const abilityData = await response.json();
    displayAbilityDetails(abilityData);
  } catch (error) {
    console.error("Error fetching ability details:", error);
    abilityDetailsContainer.innerHTML =
      "Kindly click on the MOVE NAME. Thank You!!!";
  }
}


async function displayAbilityDetails(abilityData) {
  storedPkmnColor === "white"
    ? (mainContainer.style.textShadow = `0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}`)
    : storedPkmnColor === "yellow"
    ? (mainContainer.style.textShadow = `0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}`)
    : (mainContainer.style.textShadow = `0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}`);

  abilityDetailsContainer.innerHTML = `
  <h1 style="border-bottom: 0.3rem ridge ${storedPkmnColor};">${abilityData.name
    .split("-")
    .join(" ")} (#${abilityData.id})</h1>
  <p>Gen: ${abilityData.generation.url.split("/")[6]}</p>
      <p>Description: ${
        abilityData.flavor_text_entries.length !== 0
          ? abilityData.flavor_text_entries.find(
              (entry) => entry.language.name === "en"
            ).flavor_text
          : "N/A"
      }</p>
      <p class="effect">Effect: ${
        abilityData.effect_entries.length !== 0
          ? abilityData.effect_entries.find(
              (entry) => entry.language.name === "en"
            ).short_effect
          : "N/A"
      }</p>
    `;

  mainContainer.style.setProperty("--scrollbar-thumb-color", storedPkmnColor);
  mainContainer.style.setProperty(
    "--scrollbar-track-color",
    rgbaColorsForScrollbar[storedPkmnColor]
  );

  const haveAbility = abilityData.pokemon.map((pkmn) => pkmn.pokemon.url);
  haveAbility.length !== 0
    ? await displayAllPokemon(haveAbility)
    : (() => {
        pokemonList.innerHTML += `No POKÉMON found.`;
        pokemonList.style.display = "flex";
        pokemonList.style.justifyContent = "center";
      })();

  hideLoader();
}

async function displayAllPokemon(haveAbility) {
  try {
    for (let pkmn of haveAbility) {
      await fetchPokemonDetails(pkmn);
    }
  } catch (error) {
    console.error(error);
  }
}


async function fetchPokemonDetails(url) {
  try {
    let response = await fetch(url);
    let data = await response.json();

    if (data.sprites.front_default) {
      
      let pokemonItem = document.createElement("div");
      pokemonItem.classList.add("pokemon-item");

      
      let pkmnName = data.species.name;

      
      if (pkmnName.includes("nidoran")) {
        pkmnName = pkmnName.split("-")[0]; 
      } else if (pkmnName.includes("-o")) {
        
      } else if (pkmnName.includes("type-null")) {
        pkmnName = pkmnName.replace("-", ":"); 
      } else if (pkmnName.includes("-")) {
        pkmnName = pkmnName.replace("-", " "); 
      }

      if (pkmnName.includes("mr")) {
        pkmnName = pkmnName.replace("mr", "mr.");
      } else if (pkmnName.includes("jr")) {
        pkmnName = pkmnName.replace("jr", "jr.");
      } else if (pkmnName.includes("ho-oh")) {
        pkmnName = pkmnName.replace("ho-oh", "ho oh");
      }

      pokemonItem.innerHTML = `
      <img class="pkmn-img" src="../../../../assets/pokemon-images-normal/${data.name}.png" onerror="this.onerror=null;this.src='${data.sprites.front_default}'" alt="${pkmnName}" data-name="${data.name}" loading="lazy">
            <p style="text-shadow: 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}; border-top: 0.2rem ridge ${storedPkmnColor}">${pkmnName}</p>
            `;
      pokemonItem.style.border = `0.2rem ridge ${storedPkmnColor}`;
      pokemonItem.style.background = rgbaColors[storedPkmnColor];
      pokemonList.appendChild(pokemonItem);
    }
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
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
  () => (history.back())
);


pokemonList.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG") {
    const pokemonName = event.target.getAttribute("data-name");
    sessionStorage.setItem("pokemonName", pokemonName);
    window.location.href = `../../detail.html`;
  }
});

(async () => {
  showLoader(); 

  if (storedPokemonAbilityName) {
    await fetchAbilityDetails(storedPokemonAbilityName);
  }
})();
