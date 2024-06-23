import rgbaColors from "../../../utils/rgbaColors.js";

let storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");

const pkmnEvo = document.getElementById("pkmn-evo");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".main-container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
menuList.style.border = `0.3rem ridge ${storedPkmnColor}`;
const closeMenu = document.getElementById("close-menu");

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

async function fetchPokemonEvolutionAndForms(pokemonName) {
  try {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
    );
    const speciesData = await speciesResponse.json();
    return [speciesData.evolution_chain.url, speciesData.varieties];
  } catch (error) {
    console.error("Error fetching Pokémon evolution and forms:", error);
    return [null, []];
  }
}

async function fetchEvolutionLine(evolutionChainUrl) {
  try {
    const response = await fetch(evolutionChainUrl);
    const evolutionChainData = await response.json();

    let evoChain = [];
    let evoData = evolutionChainData.chain;

    do {
      const evoDetails = evoData["evolves_to"];
      evoChain.push({
        species_name: evoData.species.name,
        min_level: !evoDetails[0]
          ? 1
          : evoDetails[0].evolution_details[0].min_level,
      });

      evoData = evoDetails.length > 0 ? evoDetails[0] : null;
    } while (!!evoData && evoData.hasOwnProperty("evolves_to"));

    return evoChain;
  } catch (error) {
    console.error("Error fetching evolution line:", error);
    return [];
  }
}

async function fetchForms(pokemonName) {
  try {
    const [_, varieties] = await fetchPokemonEvolutionAndForms(pokemonName);
    const mainForm = varieties.find((variety) => variety.is_default);
    const alternateForms = varieties.filter((variety) => !variety.is_default);

    const mainFormHtml = await fetchFormHtml(mainForm);
    const alternateFormsHtml = await Promise.all(
      alternateForms.map(fetchFormHtml)
    );

    return {
      mainFormHtml,
      alternateFormsHtml: alternateFormsHtml.filter(
        (html) => html !== undefined
      ),
    };
  } catch (error) {
    console.error("Error fetching Pokémon forms:", error);
    return { mainFormHtml: "", alternateFormsHtml: [] };
  }
}

async function fetchFormHtml(variety) {
  const response = await fetch(variety.pokemon.url);
  const formData = await response.json();

  if (formData.sprites.front_default) {
    return storedPkmnColor === "white"
      ? `
    <div class="evo-pkmn" style="border: 0.2rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 20px ${storedPkmnColor}, 0px 0px 20px ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]};">
          <img src="../../../assets/pokemon-images-normal/${formData.name}.png" onerror="this.onerror=null;this.src='${formData.sprites.front_default}'" class="form-image" alt="${formData.name}">
          <p class="form-name" style="border-top: 0.15rem solid ${storedPkmnColor}; text-shadow: 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor};">${formData.name}</p>
        </div>
      `
      : storedPkmnColor === "yellow"
      ? `
    <div class="evo-pkmn" style="border: 0.2rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 20px ${storedPkmnColor}, 0px 0px 20px ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]};">
    <img src="../../../assets/pokemon-images-normal/${formData.name}.png" onerror="this.onerror=null;this.src='${formData.sprites.front_default}'" class="form-image" alt="${formData.name}">
    <p class="form-name" style="border-top: 0.15rem solid ${storedPkmnColor}; text-shadow: 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor};">${formData.name}</p>
    </div>
  `
      : `
  <div class="evo-pkmn" style="border: 0.2rem ridge ${storedPkmnColor}; box-shadow: 0px 0px 20px ${storedPkmnColor}, 0px 0px 20px ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]};">
  <img src="../../../assets/pokemon-images-normal/${formData.name}.png" onerror="this.onerror=null;this.src='${formData.sprites.front_default}'" class="form-image" alt="${formData.name}">
  <p class="form-name" style="border-top: 0.15rem solid ${storedPkmnColor}; text-shadow: 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor};">${formData.name}</p>
  </div>
`;
  }
}

async function displayEvolutionLineAndForms(evolutionChainUrl) {
  for (let fa of faSolid) {
    fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
  }

  const evoChain = await fetchEvolutionLine(evolutionChainUrl);

  const mainFormsHtml = await Promise.all(
    evoChain.map(async (evo) => {
      const forms = await fetchForms(evo.species_name);
      return forms.mainFormHtml;
    })
  );

  const alternateFormsHtml = await Promise.all(
    evoChain.map(async (evo) => {
      const forms = await fetchForms(evo.species_name);
      return forms.alternateFormsHtml.join("");
    })
  );

  pkmnEvo.innerHTML = mainFormsHtml.join("") + alternateFormsHtml.join("");
}

pkmnEvo.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG") {
    const pokemonName = event.target.getAttribute("alt");
    sessionStorage.setItem("pokemonName", pokemonName);
    window.location.href = `../detail.html`;
  }
});

backbtn.addEventListener(
  "click",
  () => (window.location.href = "../detail.html")
);

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

(async () => {
  showLoader();
  const [evolutionChainUrl, _] = await fetchPokemonEvolutionAndForms(
    storedPokemonName
  );

  if (storedPokemonName && evolutionChainUrl) {
    await displayEvolutionLineAndForms(evolutionChainUrl);
    hideLoader();
  } else {
    hideLoader();
  }
})();
