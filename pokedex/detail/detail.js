import rgbaColors from "../../utils/rgbaColors.js";
import damageDealt from "../../utils/damageDealt.js";
import damageTaken from "../../utils/damageTaken.js";

document.addEventListener('DOMContentLoaded', function() {
  function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  function removeParameterFromUrl(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(paramName);

    // Construct the new URL without the parameter
    const newUrl = window.location.origin + window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');

    // Update the URL in the browser without reloading
    window.history.replaceState({}, '', newUrl);
  }

  const pokemonName = getParameterByName('pokemonName');

  if (pokemonName) {
    sessionStorage.setItem('pokemonName', pokemonName);
    removeParameterFromUrl('pokemonName');

    // Optionally reload the page if needed
    window.location.reload();
  }
});


const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const pokemonImage = document.getElementById("pokemon-image");
const pokemonShinyImage = document.getElementById("pokemon-shiny-image");
const pokemonGender = document.getElementById("pokemon-gender");
const pokemonDetails = document.getElementById("pokemon-details");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".main-container");
const statsContainer = document.querySelector(".stats");
const typeEffectiveness = document.getElementById("type-effectiveness");
const popUpWindow = document.getElementById("pop-up-window");
const checkmark = document.querySelector(".checkmark");

let storedPokemonCompareNameList = sessionStorage.getItem(
  "pokemonCompareNameList"
);

if (!storedPokemonCompareNameList) {
  storedPokemonCompareNameList = [];
  sessionStorage.setItem(
    "pokemonCompareNameList",
    JSON.stringify(storedPokemonCompareNameList)
  );
}

let pkmnColor,
  gen,
  pokemonEntry,
  names,
  speciesName,
  genderRate,
  storedPokemonName;

function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}

function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}

async function fetchPkmnColor_Generation_PokedexEntry_Names() {
  pokemonImage.alt = storedPokemonName;
  try {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${storedPokemonName}`
    );
    const speciesData = await speciesResponse.json();
    const generationUrl = speciesData.generation.url;

    const colorResponse = await fetch(speciesData.color.url);
    const colorData = await colorResponse.json();

    const flavorTexts = speciesData.flavor_text_entries.filter(
      (entry) => entry.language.name === "en"
    );

    const desiredLanguages = ["fr", "zh-Hans", "ja", "roomaji"];
    const namesInLanguages = {};
    speciesData.names.forEach((nameEntry) => {
      if (desiredLanguages.includes(nameEntry.language.name)) {
        namesInLanguages[nameEntry.language.name] = nameEntry.name;
      }
    });

    const species = speciesData.genera.filter(
      (entry) => entry.language.name === "en"
    );

    return [
      generationUrl.split("/")[6],
      colorData.name,
      flavorTexts.length > 0 ? flavorTexts[0].flavor_text : null,
      namesInLanguages,
      species[0].genus,
      speciesData.gender_rate,
    ];
  } catch (error) {
    console.error("Error fetching Pokémon color and generation:", error);
    return ["", "", "", ""];
  }
}

async function fetchAllDetails(
  gen,
  pkmnColor,
  pokemonEntry,
  names,
  speciesName,
  genderRate
) {
  statsContainer.style.border = "none";
  menuList.style.border = `0.3rem ridge ${pkmnColor}`;
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${storedPokemonName}`
    );
    const data = await response.json();

    pokemonImage.src = `../../assets/pokemon-images-normal/${storedPokemonName}.png`;
    pokemonImage.onerror = function () {
      this.onerror = null;
      this.src = data.sprites.front_default;
    };

    pokemonShinyImage.src = `../../assets/pokemon-images-shiny/${storedPokemonName}.png`;
    pokemonShinyImage.onerror = function () {
      this.onerror = null;
      this.src = data.sprites.front_shiny;
    };

    const stats = data.stats;
    statsContainer.style.border =
      typeEffectiveness.style.border = `0.2rem ridge ${
        pkmnColor === "black" ? "white" : null
      }`;

    gen = data.name.includes("mega")
      ? 6
      : data.name.includes("alola")
      ? 7
      : data.name.includes("galar")
      ? 8
      : data.name.includes("gmax")
      ? 8
      : data.name.includes("terastal")
      ? 9
      : data.name.includes("stellar")
      ? 9
      : gen;
    pkmnColor = pkmnColor ? pkmnColor : "gray";
    sessionStorage.setItem("pkmnColor", pkmnColor);

    document.getElementById("pokemon-id-gen-species").innerHTML = `#${
      data.id
    } - Gen ${gen} - ${speciesName ? speciesName : "N/A"}`;

    document.getElementById("pokemon-name").innerHTML = data.name;

    document.getElementById("pokemon-name-other").innerHTML = names
      ? `${names["ja"]} | ${names["fr"]} | ${names["zh-Hans"]}`
      : "";

    document.getElementById("pokemon-types").innerHTML = data.types
      .map((typeInfo) => {
        const type = typeInfo.type.name;
        return `
      <div class="type-container">
        <img src="../../assets/types/${type}.svg" onerror="this.onerror=null;this.src='../../assets/types/${type}.png';" alt="${type}" id="type-image">
        <p class="type-name">${type}</p>
      </div>
    `;
      })
      .join("");
    genderRate === -1
      ? (pokemonGender.innerHTML = `<i class="fa-solid fa-venus-mars"></i>Genderless`)
      : genderRate === undefined
      ? (pokemonGender.innerHTML = "N/A")
      : (pokemonGender.innerHTML = `<i class="fa-solid fa-mars"></i>${
          100 - genderRate * 12.5
        }% <i class="fa-solid fa-venus"></i>${genderRate * 12.5}%`);

    document.getElementById("pokemon-height-weight").innerHTML = `Height: ${
      data.height / 10
    }m, Weight: ${data.weight / 10}kg`;

    const abilities = data.abilities
      .map(
        (abilityInfo) =>
          abilityInfo.ability.name + (abilityInfo.is_hidden ? " (hidden)" : "")
      )
      .join(", ");
    document.getElementById(
      "pokemon-abilities"
    ).innerHTML = `Abilities: ${abilities}`;

    document.getElementById("pokedex-entry").innerHTML = pokemonEntry
      ? pokemonEntry.split(" ").slice(0, 25).join(" ")
      : "";

    const pokemonStats = stats
      .map(
        (stat) => `
      <div class="stat-container">
        <span class="stat-name">${
          stat.stat.name === "special-attack"
            ? "sp.atk"
            : stat.stat.name === "special-defense"
            ? "sp.def"
            : stat.stat.name
        }</span>
        <div class="progress-bar" style="box-shadow: 0 0 10px ${pkmnColor}; border: 0.1rem solid ${pkmnColor}">
          <div class="progress" style="border: 0.1rem solid ${
            pkmnColor === "black" ? "white" : null
          }; width: 0; background-color: ${pkmnColor}; text-shadow:0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black, 0 0 3px black;">${
          stat.base_stat
        }</div>
        </div>
      </div>
    `
      )
      .join("");

    statsContainer.innerHTML = pokemonStats;
    statsContainer.style.boxShadow =
      typeEffectiveness.style.boxShadow = `0px 0px 20px ${pkmnColor}`;
    statsContainer.style.background = typeEffectiveness.style.background =
      rgbaColors[pkmnColor];

    setTimeout(() => {
      const progressElements = document.querySelectorAll(".progress");
      progressElements.forEach((progress, index) => {
        progress.style.width = `${stats[index].base_stat}%`;
      });
    }, 100);

    pkmnColor === "white"
      ? (pokemonDetails.style.textShadow = `0px 0px 2px ${pkmnColor}, 0px 0px 2px ${pkmnColor}, 0px 0px 2px ${pkmnColor}, 0px 0px 2px ${pkmnColor}`)
      : pkmnColor === "yellow"
      ? (pokemonDetails.style.textShadow = `0px 0px 2px ${pkmnColor}, 0px 0px 2px ${pkmnColor}, 0px 0px 2px ${pkmnColor}, 0px 0px 2px ${pkmnColor}`)
      : (pokemonDetails.style.textShadow = `0px 0px 10px ${pkmnColor}, 0px 0px 10px ${pkmnColor}, 0px 0px 10px ${pkmnColor}, 0px 0px 10px ${pkmnColor}`);

    const typeImages = document.querySelectorAll("#type-image");
    typeImages.forEach((image) => {
      image.style.boxShadow = `0px 0px 15px ${pkmnColor}, 0px 0px 15px ${pkmnColor}`;
    });

    for (let btn of document.getElementsByTagName("button")) {
      btn.style.border = `0.3rem ridge ${
        pkmnColor === "black" ? "white" : pkmnColor
      }`;
      btn.style.background = rgbaColors[pkmnColor];
      btn.style.textShadow = `0px 0px 15px ${pkmnColor}, 0px 0px 15px ${pkmnColor}, 0px 0px 15px ${pkmnColor}, 0px 0px 15px ${pkmnColor}`;
    }

    popUpWindow.style.background = rgbaColors[pkmnColor];
    popUpWindow.style.boxShadow = `0 0 15px ${pkmnColor}, 0 0 15px ${pkmnColor}`;
    checkmark.style.boxShadow = `0 0 5px ${pkmnColor}, 0 0 5px ${pkmnColor}`;
    checkmark.style.color = pkmnColor;
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
  } finally {
    hideLoader();
    pokemonImage.style.visibility = "visible";
  }
}

async function fetchPokemonData(pokemonNameOrId) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    return null;
  }
}

async function fetchNeighboringPokemon(currentPokemonName, direction) {
  const currentPokemonData = await fetchPokemonData(currentPokemonName);
  if (!currentPokemonData) {
    return null;
  }

  let currentPokemonId = currentPokemonData.id;

  if (direction === "previous") {
    currentPokemonId -= 1;
    if (currentPokemonId < 1) {
      return null;
    }
  } else if (direction === "next") {
    currentPokemonId += 1;

    const maxPokemonId = 1010;
    if (currentPokemonId > maxPokemonId) {
      return null;
    }
  } else {
    return null;
  }

  const neighboringPokemonData = await fetchPokemonData(currentPokemonId);
  pokemonImage.style.visibility = "hidden";
  pokemonShinyImage.style.visibility = "hidden";
  return neighboringPokemonData ? neighboringPokemonData.name : null;
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

function categorizeEffectiveness(damageDealtObject, damageTakenObject) {
  const strengths = [];
  const weaknesses = [];
  const resistances = [];
  const immunities = [];

  for (const type in damageTakenObject) {
    const value = damageTakenObject[type];
    if (value > 1) {
      weaknesses.push(type);
    } else if (value === 0) {
      immunities.push(type);
    } else if (value < 1) {
      resistances.push(type);
    }
  }

  for (const type in damageDealtObject) {
    const value = damageDealtObject[type];
    if (value > 1) {
      strengths.push(type);
    }
  }

  return { strengths, weaknesses, resistances, immunities };
}

function generateTypeList(types) {
  if (types.length === 0) {
    return "N/A";
  }

  return types
    .map((type) => {
      return `<div class="type-item">
    <span class="type-name">${type}</span>
    <img style="box-shadow: 0 0 7px ${pkmnColor}, 0 0 7px ${pkmnColor};" src="../../assets/types/${type}.png" onerror="this.onerror=null;this.src='../../assets/types/${type}.svg';" alt="${type}" class="type-image">
            </div>`;
    })
    .join(" ");
}

async function displayPokemonEffectives(pokemonName) {
  const types = await getPokemonTypes(pokemonName);
  const combinedDamageDealt = combinedTypeDamageDealtOrTaken(
    types,
    damageDealt
  );
  const combinedDamageTaken = combinedTypeDamageDealtOrTaken(
    types,
    damageTaken
  );
  const { strengths, weaknesses, resistances, immunities } =
    categorizeEffectiveness(combinedDamageDealt, combinedDamageTaken);
  document.getElementById(
    "strengths"
  ).innerHTML = `Strengths: ${generateTypeList(strengths)}`;
  document.getElementById(
    "weaknesses"
  ).innerHTML = `Weaknesses: ${generateTypeList(weaknesses)}`;
  document.getElementById(
    "resistances"
  ).innerHTML = `Resistances: ${generateTypeList(resistances)}`;
  document.getElementById(
    "immunities"
  ).innerHTML = `Immunities: ${generateTypeList(immunities)}`;
}

function showToast(message) {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;

  toast.style.background = pkmnColor;
  toast.style.boxShadow = `0 0 10px ${pkmnColor}, 0 0 10px ${pkmnColor}`;

  toastContainer.appendChild(toast);

  toastContainer.classList.add("show");

  setTimeout(() => {
    toastContainer.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 3000);
}

function showPopUp(storedPokemonCompareNameList, storedPokemonName) {
  const popUp = document.getElementById("pop-up");
  const popUpMessage = document.getElementById("pop-up-message");
  popUpMessage.innerHTML = `You can only compare 6 Pokémon at a time. <br><br> Would you wish to replace ${storedPokemonCompareNameList[5]} with ${storedPokemonName}?`;

  const confirmReplace = document.getElementById("confirm-replace");
  const cancelReplace = document.getElementById("cancel-replace");

  popUp.classList.remove("hidden");

  confirmReplace.onclick = () => {
    storedPokemonCompareNameList.pop();
    storedPokemonCompareNameList.unshift(storedPokemonName);
    sessionStorage.setItem(
      "pokemonCompareNameList",
      JSON.stringify(storedPokemonCompareNameList)
    );
    popUp.classList.add("hidden");
    showToast(`${storedPokemonName} has been added to the Compare Section`);
  };

  cancelReplace.onclick = () => {
    popUp.classList.add("hidden");
  };
}

window.evolutionPage = function () {
  const nameArray = storedPokemonName.split("-");
  storedPokemonName = nameArray[0];
  sessionStorage.setItem("pokemonName", storedPokemonName);
  window.location.href = "./evolution/evolution.html";
};

window.movePage = function () {
  window.location.href = "./moves/moves.html";
};

window.locationPage = function () {
  window.location.href = "./location/location.html";
};

window.abilitiesPage = function () {
  window.location.href = "./abilities/abilities.html";
};

window.typeChartPage = function () {
  window.location.href = "./typeChart/typeChart.html";
};

window.genderPage = function () {
  window.location.href = "./gender/gender.html";
};

document.getElementById("shiny").addEventListener("click", () => {
  pokemonImage.style.visibility =
    pokemonImage.style.visibility === "visible" ? "hidden" : "visible";
  pokemonShinyImage.style.visibility =
    pokemonImage.style.visibility === "visible" ? "hidden" : "visible";
});

const doNotShow = document.getElementById("do-not-show");
doNotShow.addEventListener("click", () => {
  if (doNotShow.checked) {
    sessionStorage.setItem("doNotShowPopUp", true);
  }
  if (!doNotShow.checked) {
    sessionStorage.setItem("doNotShowPopUp", false);
  }
  const checkboxes = document.querySelectorAll(
    '.custom-checkbox input[type="checkbox"]'
  );

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const checkmark = event.target.nextElementSibling;
      if (event.target.checked) {
        checkmark.style.backgroundColor = "transparent";
        checkmark.style.setProperty("--after-border-color", "red");
      }
    });
  });
});

document.getElementById("compare").addEventListener("click", () => {
  let storedPokemonCompareNameList = sessionStorage.getItem(
    "pokemonCompareNameList"
  );
  storedPokemonCompareNameList = JSON.parse(storedPokemonCompareNameList) || [];

  if (storedPokemonCompareNameList.length >= 6) {
    const doNotShowAgain = sessionStorage.getItem("doNotShowPopUp");

    if (!JSON.parse(doNotShowAgain)) {
      showPopUp(storedPokemonCompareNameList, storedPokemonName);
      return;
    }
    storedPokemonCompareNameList.pop();
  }

  storedPokemonCompareNameList.unshift(storedPokemonName);
  sessionStorage.setItem(
    "pokemonCompareNameList",
    JSON.stringify(storedPokemonCompareNameList)
  );

  showToast(`${storedPokemonName} has been added to the Compare Section`);
});

document
  .querySelector(".back")
  .addEventListener("click", () => (window.location.href = "../pokedex.html"));

document.querySelector(".left").addEventListener("click", async () => {
  const storedPokemonName = sessionStorage.getItem("pokemonName");
  const previousPokemonName = await fetchNeighboringPokemon(
    storedPokemonName,
    "previous"
  );

  if (previousPokemonName) {
    sessionStorage.setItem("pokemonName", previousPokemonName);
    fetchPkmn();
  } else {
  }
});

document.querySelector(".right").addEventListener("click", async () => {
  const storedPokemonName = sessionStorage.getItem("pokemonName");
  const nextPokemonName = await fetchNeighboringPokemon(
    storedPokemonName,
    "next"
  );

  if (nextPokemonName) {
    sessionStorage.setItem("pokemonName", nextPokemonName);
    fetchPkmn();
  } else {
  }
});

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

const fetchPkmn = async () => {
  storedPokemonName = sessionStorage.getItem("pokemonName");

  showLoader();
  const [
    generationNumber,
    colorName,
    flavorTexts,
    namesInLanguages,
    species,
    gender_rate,
  ] = await fetchPkmnColor_Generation_PokedexEntry_Names();
  gen = generationNumber;
  pkmnColor = colorName;
  pokemonEntry = flavorTexts;
  names = namesInLanguages;
  speciesName = species;
  genderRate = gender_rate;

  if (storedPokemonName) {
    await fetchAllDetails(
      gen,
      pkmnColor,
      pokemonEntry,
      names,
      speciesName,
      genderRate
    );
    displayPokemonEffectives(storedPokemonName);
  } else {
    hideLoader();
  }
};

fetchPkmn();
