import rgbaColors from "../../../../utils/rgbaColors.js";
import rgbaColorsForScrollbar from "../../../../utils/rgbaColorsForScrollbar.js";

const storedPokemonMoveNameOrID = sessionStorage.getItem("pokemonMoveNameOrId");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");

const moveDetailsContainer = document.getElementById("move-details");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const h1 = document.getElementsByTagName("h1");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
menuList.style.border = `0.3rem ridge ${storedPkmnColor}`;
const closeMenu = document.getElementById("close-menu");
const pokemonList = document.getElementById("pokemon-list");

document.title +=
  "-" + storedPokemonMoveNameOrID.toUpperCase().split("-").join(" ");

for (let h of h1) {
  h.style.borderBottom = `0.3rem ridge ${storedPkmnColor}`;
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

async function fetchMoveDetails(moveName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    const moveData = await response.json();
    displayMoveDetails(moveData);
  } catch (error) {
    console.error("Error fetching move details:", error);
    moveDetailsContainer.innerHTML =
      "Kindly click on the MOVE NAME. Thank You!!!";
  }
}

async function displayMoveDetails(moveData) {
  for (let fa of faSolid) {
    fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
  }

  storedPkmnColor === "white"
    ? (mainContainer.style.textShadow = `0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}`)
    : storedPkmnColor === "yellow"
    ? (mainContainer.style.textShadow = `0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}`)
    : (mainContainer.style.textShadow = `0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}`);

  moveDetailsContainer.innerHTML = `
  <h1 style="border-bottom: 0.3rem ridge ${storedPkmnColor};">${moveData.name
    .split("-")
    .join(" ")} (#${moveData.id})</h1>
  <p>Gen: ${moveData.generation.url.split("/")[6]}</p>
  <div class="type">
      <img style=" border-radius: 50%; box-shadow: 0 0 15px ${storedPkmnColor}, 0 0 15px ${storedPkmnColor}, 0 0 15px ${storedPkmnColor}, 0 0 15px ${storedPkmnColor};" src="../../../../assets/types/${
    moveData.type.name
  }.svg" onerror="this.onerror=null;this.src='../../../../assets/types/${
    moveData.type.name
  }.png';" alt="${moveData.type.name}" id="type-image">
        <p>${moveData.type.name}</p>
        </div>
      <p>Power: ${moveData.power ? moveData.power : "0"}</p>
      <p>PP: ${moveData.pp ? moveData.pp : "0"}</p>
      <p>Accuracy: ${moveData.accuracy ? moveData.accuracy : "0"}</p>
      <p>Description: ${
        moveData.flavor_text_entries.length !== 0
          ? moveData.flavor_text_entries.find(
              (entry) => entry.language.name === "en"
            ).flavor_text
          : "N/A"
      }</p>
      <p>Effect: ${
        moveData.effect_entries.length !== 0
          ? moveData.effect_entries[0].short_effect
          : "N/A"
      }</p>
    `;

  mainContainer.style.setProperty("--scrollbar-thumb-color", storedPkmnColor);
  mainContainer.style.setProperty(
    "--scrollbar-track-color",
    rgbaColorsForScrollbar[storedPkmnColor]
  );

  const canLearn = moveData.learned_by_pokemon.map((pkmn) => pkmn.url);
  canLearn.length !== 0
    ? displayAllPokemon(canLearn)
    : (() => {
        pokemonList.innerHTML += `No POKÉMON found.`;
        pokemonList.style.display = "flex";
        pokemonList.style.justifyContent = "center";
      })();

  const machineUrl = moveData.machines.map((machine) => machine.machine.url);
  const machineDetails = await fetchTmNumber(machineUrl);

  if (machineDetails) {
    const groupedTMMoves = machineDetails.reduce((acc, detail) => {
      if (!acc[detail.name]) {
        acc[detail.name] = [];
      }
      acc[detail.name].push(detail.versionGroupName.split("-").join(" "));
      return acc;
    }, {});

    let tmEntries = [];
    for (const [tm, games] of Object.entries(groupedTMMoves)) {
      if (tm.startsWith("tm")) {
        let tmEntry = `<p class="tm-header">TM: ${tm.replace("m", "m ")}</p>`;
        let tmGames = `<div class="machine">`;
        games.forEach((game) => {
          tmGames += `<p class="game" style="border: 0.3rem ridge ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor};">POKÉMON ${game}</p>`;
        });
        tmGames += `</div>`;
        tmEntry += tmGames;
        tmEntries.push(tmEntry);
      }
    }

    tmEntries.forEach((tmEntry) => {
      moveDetailsContainer.innerHTML += tmEntry;
    });

    let trEntries = [];
    for (const [tm, games] of Object.entries(groupedTMMoves)) {
      if (tm.startsWith("tr")) {
        let trEntry = `<p class="tm-header">TR: ${tm.replace("r", "r ")}</p>`;
        let tmGames = `<div class="machine">`;
        games.forEach((game) => {
          tmGames += `<p class="game" style="border: 0.3rem ridge ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor};">POKÉMON ${game}</p>`;
        });
        tmGames += `</div>`;
        trEntry += tmGames;
        trEntries.push(trEntry);
      }
    }

    trEntries.forEach((trEntry) => {
      moveDetailsContainer.innerHTML += trEntry;
    });

    let hmEntries = [];
    for (const [tm, games] of Object.entries(groupedTMMoves)) {
      if (tm.startsWith("hm")) {
        let hmEntry = `<p class="tm-header">HM: ${tm.replace("m", "m ")}</p>`;
        let tmGames = `<div class="machine">`;
        games.forEach((game) => {
          tmGames += `<p class="game" style="border: 0.3rem ridge ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]}; box-shadow: 0px 0px 10px ${storedPkmnColor}, 0px 0px 10px ${storedPkmnColor};">POKÉMON ${game}</p>`;
        });
        tmGames += `</div>`;
        hmEntry += tmGames;
        hmEntries.push(hmEntry);
      }
    }

    hmEntries.forEach((hmEntry) => {
      moveDetailsContainer.innerHTML += hmEntry;
    });
  }

  hideLoader();
}

async function displayAllPokemon(canLearn) {
  try {
    for (let pkmn of canLearn) {
      await fetchPokemonDetails(pkmn);
    }
  } catch (error) {
    console.error(error);
  }
}

async function fetchTmNumber(machineUrls) {
  let machineDetails = [];

  try {
    for (let url of machineUrls) {
      const machineDetail = await fetchTmDetails(url);
      machineDetails.push(machineDetail);
    }
    return machineDetails;
  } catch (error) {
    console.error(error);
  }
}

async function fetchTmDetails(url) {
  const machine = await fetch(url);
  const machineResponse = await machine.json();
  return {
    name: machineResponse.item.name,
    versionGroupName: machineResponse.version_group.name,
  };
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

backbtn.addEventListener("click", () => history.back());

pokemonList.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG") {
    const pokemonName = event.target.getAttribute("data-name");
    sessionStorage.setItem("pokemonName", pokemonName);
    window.location.href = `../../detail.html`;
  }
});

(async () => {
  showLoader();

  if (storedPokemonMoveNameOrID) {
    await fetchMoveDetails(storedPokemonMoveNameOrID);
  }
})();
