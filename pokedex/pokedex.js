const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const backbtn = document.querySelector(".back");
const searchInput = document.getElementById("search-input");
const clearSearchInput = document.getElementById("clear-search-input");
const pokemonList = document.getElementById("pokemon-list");
const filter = document.getElementById("filter");
const dropDown = document.getElementById("drop-down");
const allGen = document.getElementById("allgens");
const gen1 = document.getElementById("gen1");
const gen2 = document.getElementById("gen2");
const gen3 = document.getElementById("gen3");
const gen4 = document.getElementById("gen4");
const gen5 = document.getElementById("gen5");
const gen6 = document.getElementById("gen6");
const gen7 = document.getElementById("gen7");
const gen8 = document.getElementById("gen8");
const gen9 = document.getElementById("gen9");
const mega = document.getElementById("mega");
const alola = document.getElementById("alola");
const galar = document.getElementById("galar");
const hisui = document.getElementById("hisui");
const gmax = document.getElementById("gmax");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".main-container");

let allPokemonResults = [];
let pokemonResults = [];

searchInput.value = "";


function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}


function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
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
        <img class="pkmn-img" src="../assets/pokemon-images-normal/${data.name}.png" onerror="this.onerror=null;this.src='${data.sprites.front_default}'" alt="${pkmnName}" data-name="${data.name}" loading="lazy">
        <p>${pkmnName}</p>
`;
      pokemonList.appendChild(pokemonItem);
    }
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
  }
}


async function displayAllPokemon(pokemonResults) {
  try {
    const fetchPromises = pokemonResults.map((pokemon) =>
      fetchPokemonDetails(pokemon.url)
    );
    await Promise.all(fetchPromises);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  } finally {
    hideLoader(); 
  }
}

async function fetchAllPokemon(offset, limit) {
  pokemonResults = [];
  allPokemonResults = [];
  searchInput.value = "";

  pokemonList.innerHTML = "";
  showLoader(); 
  try {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    ); 
    let data = await response.json();
    pokemonResults = data.results;
    allPokemonResults = data.results;
    await displayAllPokemon(pokemonResults);
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}


async function displayFilteredPokemon(searchTerm) {
  pokemonList.innerHTML = ""; 
  showLoader(); 

  const fetchFilteredPokemon = async (filteredPokemon) => {
    const fetchPromises = filteredPokemon.map((pokemon) =>
      fetchPokemonDetails(pokemon.url)
    );
    await Promise.all(fetchPromises);
    hideLoader(); 
  };

  if (searchTerm) {
    let filteredPokemon = pokemonResults.filter((pokemon) =>
      pokemon.name.includes(searchTerm.toLowerCase())
    );
    await fetchFilteredPokemon(filteredPokemon);
  } else if (mega.checked) {
    
    
    const megaPokemonList = allPokemonResults.filter((pokemon) =>
      pokemon.name.includes("mega")
    );
    await fetchFilteredPokemon(megaPokemonList);
  } else if (alola.checked) {
    const alolaPokemonList = allPokemonResults.filter((pokemon) =>
      pokemon.name.includes("alola")
    );
    await fetchFilteredPokemon(alolaPokemonList);
  } else if (galar.checked) {
    const galarPokemonList = allPokemonResults.filter((pokemon) =>
      pokemon.name.includes("galar")
    );
    await fetchFilteredPokemon(galarPokemonList);
  } else if (hisui.checked) {
    const hisuiPokemonList = allPokemonResults.filter((pokemon) =>
      pokemon.name.includes("hisui")
    );
    await fetchFilteredPokemon(hisuiPokemonList);
  } else if (gmax.checked) {
    const gmaxPokemonList = allPokemonResults.filter((pokemon) =>
      pokemon.name.includes("gmax")
    );
    await fetchFilteredPokemon(gmaxPokemonList);
  } else {
    fetchAllPokemon();
  }
}

function handleGenChange() {
  showLoader(); 
  if (allGen.checked) {
    fetchAllPokemon(0, 1500); 
  } else if (gen1.checked) {
    fetchAllPokemon(0, 151);
  } else if (gen2.checked) {
    fetchAllPokemon(151, 100);
  } else if (gen3.checked) {
    fetchAllPokemon(251, 135);
  } else if (gen4.checked) {
    fetchAllPokemon(386, 107);
  } else if (gen5.checked) {
    fetchAllPokemon(493, 156);
  } else if (gen6.checked) {
    fetchAllPokemon(649, 72);
  } else if (gen7.checked) {
    fetchAllPokemon(721, 88);
  } else if (gen8.checked) {
    fetchAllPokemon(809, 96);
  } else if (gen9.checked) {
    fetchAllPokemon(905, 103);
  } else if (mega.checked) {
    displayFilteredPokemon(false);
  } else if (alola.checked) {
    displayFilteredPokemon(false);
  } else if (galar.checked) {
    displayFilteredPokemon(false);
  } else if (hisui.checked) {
    displayFilteredPokemon(false);
  } else if (gmax.checked) {
    displayFilteredPokemon(false);
  }
  searchInput.value = "";
  dropDown.classList.toggle("show-drop-down");
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

clearSearchInput.addEventListener("click", () => {
  searchInput.value = "";
  start();
});

backbtn.addEventListener("click", () => (window.location.href = "../"));

searchInput.addEventListener("keydown", () => {});


let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    displayFilteredPokemon(searchInput.value.trim());
  }, 1000); 
});


pokemonList.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG") {
    const pokemonName = event.target.getAttribute("data-name");
    sessionStorage.setItem("pokemonName", pokemonName);
  } else if (event.target.tagName === "P") {
    const pokemonName = event.target.innerHTML;
    sessionStorage.setItem("pokemonName", pokemonName);
  }
  window.location.href = `detail/detail.html`;
});

filter.addEventListener("click", () => {
  dropDown.classList.toggle("show-drop-down");
});

allGen.addEventListener("change", handleGenChange);
gen1.addEventListener("change", handleGenChange);
gen2.addEventListener("change", handleGenChange);
gen3.addEventListener("change", handleGenChange);
gen4.addEventListener("change", handleGenChange);
gen5.addEventListener("change", handleGenChange);
gen6.addEventListener("change", handleGenChange);
gen7.addEventListener("change", handleGenChange);
gen8.addEventListener("change", handleGenChange);
gen9.addEventListener("change", handleGenChange);
mega.addEventListener("change", handleGenChange);
alola.addEventListener("change", handleGenChange);
galar.addEventListener("change", handleGenChange);
hisui.addEventListener("change", handleGenChange);
gmax.addEventListener("change", handleGenChange);

const start = () => {
  let selectedFilter = "allgens";
  if (selectedFilter || searchInput.value === "") {
    document.getElementById(selectedFilter).checked = true;
    dropDown.classList.toggle("show-drop-down");
    handleGenChange();
  }
};

start();
