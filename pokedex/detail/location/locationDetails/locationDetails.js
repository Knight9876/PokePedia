import rgbaColors from "../../../../utils/rgbaColors.js";
import rgbaColorsForScrollbar from "../../../../utils/rgbaColorsForScrollbar.js";

const storedPokemonLocation = sessionStorage.getItem("pokemonLocation");
const storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");

const faSolid = document.querySelectorAll(".fa-solid");
const h1 = document.getElementsByTagName("h1");
const encounter1Container = document.getElementById("encounter-1");
const encounter2Container = document.getElementById("encounter-2");
const encounter3Container = document.getElementById("encounter-3");
const mainContainer = document.querySelector(".main-container ");
const loader = document.getElementById("loader");
const locationName = document.querySelector(".location-name");
const pokemonName = document.querySelector(".pokemon-name");
const popUp = document.getElementById("pop-up");
const popUpWindow = document.getElementById("pop-up-window");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
menuList.style.border = `0.3rem ridge ${storedPkmnColor}`
const closeMenu = document.getElementById("close-menu");
const backbtn = document.querySelector(".back");

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

pokemonName.innerHTML += `Pokémon: ${
  storedPokemonName ? storedPokemonName : "N/A"
}`;
locationName.innerHTML += `Location: ${storedPokemonLocation
  .split("-")
  .join(" ")}`;

storedPkmnColor === "white"
  ? (mainContainer.style.textShadow = `0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}`)
  : storedPkmnColor === "yellow"
  ? (mainContainer.style.textShadow = `0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}`)
  : (mainContainer.style.textShadow = `0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}`);

for (let fa of faSolid) {
  fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
}

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

mainContainer.style.setProperty("--scrollbar-thumb-color", storedPkmnColor);
mainContainer.style.setProperty(
  "--scrollbar-track-color",
  rgbaColorsForScrollbar[storedPkmnColor]
);

async function fetchPokemonLocation2() {
  try {
    loader.style.visibility = "visible";
    let response;
    if (storedPokemonName) {
      response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${storedPokemonName}/encounters`
      );
    } else {
      response = await fetch(
        `https://pokeapi.co/api/v2/location-area/${storedPokemonLocation}`
      );
    }
    const data = await response.json();
    const locationArea = data.map((area) => area.location_area.name);
    const locationUrls = data.map((area) => area.location_area.url);
    let locationUrl;
    for (let location in locationArea) {
      if (locationArea[location].startsWith(storedPokemonLocation)) {
        locationUrl = locationUrls[location];
      }
    }
    fetchLocationDetails2(locationUrl);
    loader.style.visibility = "hidden";
  } catch (error) {
    console.error("Error fetching location details:", error);
    encounter2Container.innerHTML = "<p>Failed to load encounter details.</p>";
    encounter3Container.innerHTML = "<p>Failed to load encounter details.</p>";
    loader.style.visibility = "hidden";
  }
}

async function fetchLocationDetails2(locationUrl) {
  try {
    const response = await fetch(locationUrl);
    const data = await response.json();

    
    const encounterDetails = [];

    
    data.encounter_method_rates.forEach((methodRate) => {
      methodRate.version_details.forEach((versionDetail) => {
        encounterDetails.push({
          method: methodRate.encounter_method.name,
          rate: versionDetail.rate,
          version: versionDetail.version.name,
        });
      });
    });

    
    displayEncounterDetails2(encounterDetails);

    displayEncounters(data.pokemon_encounters);
  } catch (error) {
    console.error("Error fetching location details:", error);
  }
}

function displayEncounterDetails2(encounterDetails) {
  if (!encounterDetails.length) {
    encounter2Container.innerHTML = "<p>No encounter Methods available.</p>";
    return;
  }

  const groupedEncounters = encounterDetails.reduce((acc, detail) => {
    if (!acc[detail.method]) {
      acc[detail.method] = [];
    }
    acc[detail.method].push({
      rate: detail.rate,
      version: detail.version.replace(/-/g, " "),
    });
    return acc;
  }, {});

  for (const [method, details] of Object.entries(groupedEncounters)) {
    const methodElement = document.createElement("div");
    methodElement.style.border = `0.3rem ridge ${storedPkmnColor}`;
    methodElement.style.boxShadow = `0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}`;
    methodElement.style.background = rgbaColors[storedPkmnColor];
    methodElement.classList.add("encounter-method");
    methodElement.innerHTML = `<p style="border-bottom: 0.3rem ridge ${storedPkmnColor}; text-align: center; padding-bottom: 1rem; border-radius: 0.5rem">Method: ${method.replace(
      /-/g,
      " "
    )}</p>`;

    details.forEach((detail) => {
      const detailElement = document.createElement("div");
      detailElement.classList.add("encounter-detail-2");
      detailElement.innerHTML = `
        <p class="rate">Rate: ${detail.rate}%</p>
        <p class="game">Game: Pokémon ${detail.version}</p>
      `;
      methodElement.appendChild(detailElement);
    });

    encounter2Container.appendChild(methodElement);
  }
}

async function fetchPokemonLocation1() {
  try {
    loader.style.visibility = "visible";
    let locationData = "";
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${storedPokemonName}/encounters`
    );
    const data = await response.json();
    for (let d of data) {
      if (d.location_area.name.startsWith(storedPokemonLocation)) {
        locationData = d;
      }
    }
    displayEncounterDetails1(locationData);
    loader.style.visibility = "hidden";
  } catch (error) {
    console.error("Error fetching location details:", error);
    encounter1Container.innerHTML = "<p>No encounter details available.</p>";
    loader.style.visibility = "hidden";
  }
}

function displayEncounterDetails1(locationData) {
  if (
    !locationData ||
    !locationData.version_details ||
    locationData.version_details.length === 0
  ) {
    encounter1Container.innerHTML = "<p>No encounter details available.</p>";
    return;
  }

  locationData.version_details.forEach((versionDetail) => {
    const versionName = versionDetail.version.name.split("-").join(" ");

    versionDetail.encounter_details.forEach((encounterDetail) => {
      const methodName = encounterDetail.method.name.split("-").join(" ");
      const chance = encounterDetail.chance;
      const minLevel = encounterDetail.min_level;
      const maxLevel = encounterDetail.max_level;
      const conditions = encounterDetail.condition_values
        .map((condition) =>
          condition.name.replace("story-progress", "").split("-").join(" ")
        )
        .join(", ");

      encounter1Container.innerHTML += `
      <div class="encounter-detail-1" style="border: 0.3rem ridge ${storedPkmnColor}; background: ${
        rgbaColors[storedPkmnColor]
      }; box-shadow: 0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor};">
      <p style="border-bottom: 0.3rem ridge ${storedPkmnColor}; text-align: center; padding-bottom: 1rem; border-radius: 0.5rem;">Game: Pokémon ${versionName}</p>
      <p style="padding-top: 1rem">Method: ${methodName}</p>
      <p>Chance: ${chance}%</p>
      <p>Lvl. Range: ${minLevel} - ${maxLevel}</p>
      <p>Conditions: ${conditions ? conditions : "N/A"}</p>
      </div>
      `;
    });
  });
}

function displayEncounters(encounterDetails) {
  if (!encounterDetails.length) {
    encounter3Container.innerHTML = "<p>No Pokémon available.</p>";
    return;
  }

  const groupedEncounters = encounterDetails.reduce((acc, detail) => {
    detail.version_details.forEach((versionDetail) => {
      const versionName = versionDetail.version.name.replace(/-/g, " ");
      if (!acc[versionName]) {
        acc[versionName] = [];
      }
      versionDetail.encounter_details.forEach((encounterDetail) => {
        acc[versionName].push({
          pokemon: detail.pokemon.name,
          chance: encounterDetail.chance,
          min_level: encounterDetail.min_level,
          max_level: encounterDetail.max_level,
          method: encounterDetail.method.name.replace(/-/g, " "),
          conditions: encounterDetail.condition_values
            .map((cond) =>
              cond.name.replace("story-progress", "").split("-").join(" ")
            )
            .join(", "),
        });
      });
    });
    return acc;
  }, {});

  const encounter3Container = document.getElementById("encounter-3");
  encounter3Container.innerHTML = "";
  let count = 0;
  Object.entries(groupedEncounters).forEach(([version, encounters]) => {
    const versionDiv = document.createElement("div");
    versionDiv.classList.add("version-group");

    encounters.forEach((encounter) => {
      const encounterItem = document.createElement("div");
      encounterItem.classList.add("encounter-detail-3");
      encounterItem.innerHTML = `
        <p style="border-bottom: 0.3rem ridge ${storedPkmnColor}; text-align: center; padding-bottom: 1rem; border-radius: 0.5rem;">Game: Pokémon ${version}</p>
        <p style="padding-top: 1rem">Pokémon: ${encounter.pokemon}</p>
        <p>Method: ${encounter.method}</p>
        <p>Chance: ${encounter.chance}%</p>
        <p>Lvl. Range: ${encounter.min_level} - ${encounter.max_level}</p>
        <p>Conditions: ${
          encounter.conditions ? encounter.conditions : "N/A"
        }</p>
      `;
      encounterItem.style.border = `0.3rem ridge ${storedPkmnColor}`;
      encounterItem.style.background = rgbaColors[storedPkmnColor];
      encounterItem.style.boxShadow = `0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}`;
      versionDiv.appendChild(encounterItem);
    });

    versionDiv.innerHTML += "<p></p><p></p><p></p><p></p>";
    encounter3Container.appendChild(versionDiv);
  });
}

function itemDetails(itemDetails) {
  popUpWindow.innerHTML = `
  <button type="button"><i class="fa-solid fa-xmark close-pop-up" style="text-shadow: 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor};"></i></button>
    <div class="pop-up-content">
      <img src="${itemDetails.sprites.default}" alt="${
    itemDetails.name
  }" style="border: 0.3rem ridge ${storedPkmnColor}; background: ${storedPkmnColor};">
      <p>ID: ${itemDetails.id}</p>
      <p>Name: ${itemDetails.name.replace(/-/g, " ")}</p>
      <p>Category: ${itemDetails.category.name.replace(/-/g, " ")}</p>
      <p>Description: ${
        itemDetails.flavor_text_entries.find(
          (entry) => entry.language.name === "en"
        ).text
      }</p>
      <p>Effect: ${itemDetails.effect_entries[0].short_effect}</p>
    </div>
  `;
}


async function handleItemClick(itemName, itemList) {
  const item = itemList.find((item) => item.name === itemName.toLowerCase());

  if (!item) {
    console.error("Item not found:", itemName);
    popUpWindow.innerHTML = `
    <button type="button"><i class="fa-solid fa-xmark close-pop-up" style="text-shadow: 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor};"></i></button>
    <p>No Details Found.</p>
    `;
    return;
  }

  try {
    const response = await fetch(item.url);
    const itemResponse = await response.json();
    itemDetails(itemResponse);
  } catch (error) {
    console.error("Error fetching item details:", error);
  }
}


async function fetchItemsList(methodName) {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/item?limit=2170");
    const data = await response.json();
    handleItemClick(methodName, data.results);
  } catch (error) {
    popUp.style.visibility = "hidden";
    console.error("Error fetching items list:", error);
  }
}

async function displayItemDetails(methodName) {
  loader.style.visibility = "visible";
  mainContainer.scrollTo({ top: 0, behavior: "smooth" });
  mainContainer.style.overflow = "hidden";
  popUpWindow.style.background = rgbaColors[storedPkmnColor];
  await fetchItemsList(methodName);
  popUp.style.visibility = "visible";
  popUp.classList.toggle("show-pop-up");
  popUpWindow.style.border = `0.3rem ridge ${storedPkmnColor}`;
  popUpWindow.style.boxShadow = `0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}`;
  loader.style.visibility = "hidden";
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

popUp.addEventListener("click", () => {
  mainContainer.style.overflow = "auto";
  popUp.classList.toggle("show-pop-up");
  popUp.style.visibility = "hidden";
});

backbtn.addEventListener(
  "click",
  () => (history.back())
);

mainContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    if (event.target.innerHTML.startsWith("Pokémon: ")) {
      const pkmnName = event.target.innerHTML.replace("Pokémon: ", "");
      sessionStorage.setItem("pokemonName", pkmnName);
      window.location.href = "../../detail.html";
    } else if (event.target.innerHTML.startsWith("Method: ")) {
      const methodName = event.target.innerHTML
        .replace("Method: ", "")
        .split(" ")
        .join("-");
      if (hmMovesName.includes(methodName)) {
        sessionStorage.setItem("pokemonMoveNameOrId", methodName);
        window.location.href = "../../moves/moveDetails/moveDetails.html";
      } else {
        displayItemDetails(methodName);
      }
    }
  }
});

fetchPokemonLocation1();
if (storedPokemonName !== "N/A") {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
  fetchPokemonLocation2();
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
} else {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
  await fetchLocationDetails2(
    `https://pokeapi.co/api/v2/location-area/${storedPokemonLocation}`
  );
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}
