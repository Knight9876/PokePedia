import damageDealt from "../utils/damageDealt.js";
import damageTaken from "../utils/damageTaken.js";

let storedPokemonCompareNameList = sessionStorage.getItem(
  "pokemonCompareNameList"
);
storedPokemonCompareNameList = JSON.parse(storedPokemonCompareNameList) || [];

const mainContainer = document.querySelector(".main-container");
const compareContainer = document.getElementById("compare");
const typeChartContainer = document.getElementById("type-chart");
const loader = document.getElementById("loader");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const filter = document.getElementById("filter");
const backbtn = document.querySelector(".back");
const dropDown = document.getElementById("drop-down");
const basic = document.getElementById("basic");
const stats = document.getElementById("stats");
const dmgDealt = document.getElementById("damage-dealt");
const dmgTaken = document.getElementById("damage-taken");
const effective = document.getElementById("effective");

async function fetchPokemonBasicInfo(pokemonNames) {
  compareContainer.innerHTML = typeChartContainer.innerHTML = "";
  for (const pokemonName of pokemonNames) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await response.json();

      const speciesResponse = await fetch(data.species.url);
      const speciesData = await speciesResponse.json();

      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();

      const evolutionDetails = getEvolutionDetails(
        evolutionData.chain,
        pokemonName
      );
      const evolutionInfo = evolutionDetails
        ? evolutionDetails.condition === "level-up"
          ? `Lvl. ${evolutionDetails.level}`
          : evolutionDetails.condition : "N/A"

      const pokemonHtml = `
        <div class="compare-container">
          <img src="../assets/pokemon-images-normal/${pokemonName}.png" onerror="this.onerror=null;this.src='${
        data.sprites.front_default
      }';" alt="${pokemonName}" class="pokemon-image"/>
          <h2>${data.name}</h2>
          <div class="pokemon-info">
            <p>ID: ${data.id}</p>
            <p>Gen: ${speciesData.generation.url.split("/")[6]}</p>
            <div class="image-type">${data.types
              .map((type) => {
                type.type.name;
                return `
                <img src="../../assets/types/${type.type.name}.svg" onerror="this.onerror=null;this.src='../../assets/types/${type.type.name}.png';" alt="${type.type.name}" id="type-image">
                <p class="type-name">${type.type.name}</p>
            `;
              })
              .join("")}</div>
            <p>Height: ${data.height / 10} m</p>
            <p>Weight: ${data.weight / 10} kg</p>
            <p>Color: ${speciesData.color.name}</p>
            <div class="gender">${
              speciesData.gender_rate === -1
                ? "Genderless"
                : `<p>${
                    100 - speciesData.gender_rate * 12.5
                  }%<i class="fa-solid fa-mars"></i> </p><p>${
                    speciesData.gender_rate * 12.5
                  }%<i class="fa-solid fa-venus"></i></p>`
            }</div>
            <p>Evolve: ${evolutionInfo}</p>
            </div>
        </div>
      `;

      compareContainer.innerHTML += pokemonHtml;
    } catch (error) {
      console.error(
        `Error fetching basic information for ${pokemonName}:`,
        error
      );
    }
  }
}

function getEvolutionDetails(evolutionChain, pokemonName) {
  if (evolutionChain.species.name === pokemonName) {
    return { level: 1, condition: null }; 
  }

  let currentChain = evolutionChain;
  while (currentChain.evolves_to.length > 0) {
    for (const evolvesTo of currentChain.evolves_to) {
      if (evolvesTo.species.name === pokemonName) {
        const evolutionDetails = evolvesTo.evolution_details[0];
        return {
          level: evolutionDetails.min_level || "Special Condition",
          condition: evolutionDetails.trigger.name || null,
        };
      }
      currentChain = evolvesTo;
    }
  }

  return null; 
}

async function fetchPokemonStats(pokemonNames) {
  compareContainer.innerHTML = typeChartContainer.innerHTML = "";
  for (const pokemonName of pokemonNames) {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await response.json();

      const pokemonHtml = `
        <div class="compare-container">
          <img src="../assets/pokemon-images-normal/${pokemonName}.png" onerror="this.onerror=null;this.src='${
        data.sprites.front_default
      }';" alt="${pokemonName}" class="pokemon-image"/>
          <div class="pokemon-stats">
            ${data.stats
              .map(
                (stat) => `
              <div class="stat-container">
              <span class="stat-name">${stat.stat.name
                .replace("special-attack", "sp.atk")
                .replace("special-defense", "sp.def")}</span>
                <div class="progress-bar">
                <div class="progress" style="--progress-width: ${
                  stat.base_stat
                }%;">${stat.base_stat}</div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;

      compareContainer.innerHTML += pokemonHtml;
    } catch (error) {
      console.error(`Error fetching stats for ${pokemonName}:`, error);
    }
  }
}


async function fetchPokemonData(pokemonName) {
  try {
    const localImageUrl = `../assets/pokemon-images-normal/${pokemonName}.png`;

    
    const localImageResponse = await fetch(localImageUrl);
    if (localImageResponse.ok) {
      
      return {
        name: pokemonName,
        image: localImageUrl,
      };
    } else {
      
      const pokeApiResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      const data = await pokeApiResponse.json();
      const imageUrl = data.sprites.front_default;
      return {
        name: pokemonName,
        image: imageUrl,
      };
    }
  } catch (error) {
    console.error(`Error fetching data for ${pokemonName}:`, error);
    return {
      name: pokemonName,
      image: "", 
    };
  }
}


async function fetchTypeEffectiveness(pokemonName, damageObject) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();
    const types = data.types.map((typeInfo) => typeInfo.type.name);

    const combinedDamageDealtOrTaken = {};
    for (const type in damageObject) {
      combinedDamageDealtOrTaken[type] = 1;
    }

    types.forEach((type) => {
      for (const targetType in damageObject[type]) {
        combinedDamageDealtOrTaken[targetType] *=
          damageObject[type][targetType];
      }
    });

    return combinedDamageDealtOrTaken;
  } catch (error) {
    console.error(
      `Error fetching type effectiveness for ${pokemonName}:`,
      error
    );
    return {};
  }
}


async function displayTypeChart(pokemonNames, damageObject) {
  compareContainer.innerHTML = typeChartContainer.innerHTML = "";
  const typeEffectivenessData = {};
  const allTypes = new Set();
  const pokemonDataList = [];

  
  for (const pokemonName of pokemonNames) {
    const effectiveness = await fetchTypeEffectiveness(
      pokemonName,
      damageObject
    );
    const pokemonData = await fetchPokemonData(pokemonName);
    typeEffectivenessData[pokemonName] = effectiveness;
    pokemonDataList.push(pokemonData);
    Object.keys(effectiveness).forEach((type) => allTypes.add(type));
  }

  
  let tableHtml = "<table><thead><tr><th>Type</th>";
  pokemonDataList.forEach((pokemon) => {
    tableHtml += `<th><img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-image"/></th>`;
  });
  tableHtml += "</tr></thead><tbody>";

  
  allTypes.forEach((type) => {
    tableHtml += `<tr><td style="background-color:${getTypeBackgroundColorForType(
      type
    )}">${type}</td>`;
    pokemonNames.forEach((name) => {
      const effectiveness = typeEffectivenessData[name][type];
      tableHtml += `<td style="background-color: ${getTypeBackgroundColorForEffectiveness(
        effectiveness
      )}";>${effectiveness}</td>`;
    });
    tableHtml += "</tr>";
  });

  tableHtml += "</tbody></table>";
  typeChartContainer.innerHTML = tableHtml;
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
    <img src="../assets/types/${type}.png" onerror="this.onerror=null;this.src='../assets/types/${type}.svg';" alt="${type}" class="type-image">
            </div>`;
    })
    .join(" ");
}

async function displayPokemonEffectives(pokemonNames) {
  compareContainer.innerHTML = typeChartContainer.innerHTML = "";

  for (const pokemonName of pokemonNames) {
    try {
      const pokemonData = await fetchPokemonData(pokemonName); 

      
      const { name, image } = pokemonData;

      const combinedDamageDealt = await fetchTypeEffectiveness(
        pokemonName,
        damageDealt
      );
      const combinedDamageTaken = await fetchTypeEffectiveness(
        pokemonName,
        damageTaken
      );
      const { strengths, weaknesses, resistances, immunities } =
        categorizeEffectiveness(combinedDamageDealt, combinedDamageTaken);

      
      const pokemonHtml = `
        <div class="compare-container">
          <img src="${image}" alt="${name}" class="pokemon-image"/>
          <h2>${name}</h2><br>
          <div class="type-effective">Strengths: ${
            strengths.length !== 0 ? generateTypeList(strengths) : "N/A"
          }</div><br>
          <div class="type-effective">Weaknesses: ${
            weaknesses.length !== 0 ? generateTypeList(weaknesses) : "N/A"
          }</div><br>
          <div class="type-effective">Resistances: ${
            resistances.length !== 0 ? generateTypeList(resistances) : "N/A"
          }</div><br>
          <div class="type-effective">Immunities: ${
            immunities.length !== 0 ? generateTypeList(immunities) : "N/A"
          }</div>
        </div>
      `;
      compareContainer.innerHTML += pokemonHtml;
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

function getTypeBackgroundColorForType(type) {
  return type === "normal"
    ? "grey"
    : type === "fighting"
    ? "red"
    : type === "flying"
    ? "rgb(0, 183, 255)"
    : type === "poison"
    ? "purple"
    : type === "ground"
    ? "#a0522d"
    : type === "rock"
    ? "#8b0000"
    : type === "bug"
    ? "yellowgreen"
    : type === "ghost"
    ? "rgb(49, 0, 72)"
    : type === "steel"
    ? "rgb(93, 93, 93)"
    : type === "fire"
    ? "rgb(255, 98, 0)"
    : type === "water"
    ? "blue"
    : type === "grass"
    ? "green"
    : type === "electric"
    ? "yellow"
    : type === "psychic"
    ? "rgb(255, 0, 132)"
    : type === "ice"
    ? "cyan"
    : type === "dragon"
    ? "rgb(100, 0, 171)"
    : type === "dark"
    ? "black"
    : type === "fairy"
    ? "hotpink"
    : "white"; 
}

function getTypeBackgroundColorForEffectiveness(effectiveness) {
  return effectiveness === 0
    ? "black"
    : effectiveness === 0.25
    ? "skyblue"
    : effectiveness === 0.5
    ? "cyan"
    : effectiveness === 1
    ? "blue"
    : effectiveness === 2
    ? "lime"
    : "red";
}

async function handleGenChange() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
  if (basic.checked) {
    await fetchPokemonBasicInfo(storedPokemonCompareNameList); 
  } else if (stats.checked) {
    await fetchPokemonStats(storedPokemonCompareNameList);
  } else if (dmgDealt.checked) {
    await displayTypeChart(storedPokemonCompareNameList, damageDealt);
  } else if (dmgTaken.checked) {
    await displayTypeChart(storedPokemonCompareNameList, damageTaken);
  } else if (effective.checked) {
    await displayPokemonEffectives(storedPokemonCompareNameList);
  }
  dropDown.classList.toggle("show-drop-down");
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
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

backbtn.addEventListener("click", () => (window.location.href = "../"));

filter.addEventListener("click", () => {
  dropDown.classList.toggle("show-drop-down");
});

basic.addEventListener("change", handleGenChange);
stats.addEventListener("change", handleGenChange);
dmgDealt.addEventListener("change", handleGenChange);
dmgTaken.addEventListener("change", handleGenChange);
effective.addEventListener("change", handleGenChange);

const start = () => {
  if (storedPokemonCompareNameList.length === 0) {
    compareContainer.innerHTML = `
      <p>No Pokémon in the compare list. Go to the <a style="color: red; cursor: pointer;" href="../pokedex/pokedex.html">Pokédex</a> to add some Pokémon.</p>
    `;
    loader.style.visibility = "hidden"
    return;
  }
  let selectedFilter = "basic";
  if (selectedFilter || searchInput.value === "") {
    document.getElementById(selectedFilter).checked = true;
    dropDown.classList.toggle("show-drop-down");
    handleGenChange();
  }
};

start();
