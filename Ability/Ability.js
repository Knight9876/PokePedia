const abilitiesContainer = document.querySelector(".abilities");
const backbtn = document.querySelector(".back");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".main-container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const searchInput = document.getElementById("search-input");
const dropDown = document.getElementById("drop-down");
const clearSearchInput = document.getElementById("clear-search-input");
const allAbilities = document.getElementById("allAbilities");
const hidden = document.getElementById("hidden");


function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}


function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}


async function fetchAllAbilities() {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/ability?limit=1000"
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching abilities:", error);
    return [];
  }
}


async function fetchAbilityDetails(abilityUrl) {
  try {
    const response = await fetch(abilityUrl);
    return await response.json();
  } catch (error) {
    console.error("Error fetching ability details:", error);
    return null;
  }
}


async function displayAllAbilities() {
  const allAbilities = await fetchAllAbilities();
  let abilitiesHtml = "";

  for (let ability of allAbilities) {
    abilitiesHtml += `
        <div class="abilities-container">
          <p class="ability-id">Ab. ${ability.url.split("/")[6]}</p>
          <p class="ability-name">${ability.name.split("-").join(" ")}</p>
        </div>
      `;
  }

  abilitiesContainer.innerHTML = abilitiesHtml;
}


async function displayFilteredAbilities(query) {
  const allAbilities = await fetchAllAbilities();
  let filteredAbilitiesHtml = "";

  for (let ability of allAbilities) {
    if (ability && ability.name.includes(query.toLowerCase())) {
      filteredAbilitiesHtml += `
        <div class="abilities-container">
          <p class="ability-id">Ab. ${ability.url.split("/")[6]}</p>
          <p class="ability-name">${ability.name
            .split("-")
            .join(" ")}</p>
        </div>
      `;
    }
  }

  abilitiesContainer.innerHTML = filteredAbilitiesHtml;
}

abilitiesContainer.style.setProperty("--scrollbar-thumb-color", "white");
abilitiesContainer.style.setProperty("--scrollbar-track-color", "grey");

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
  () => (window.location.href = "../")
);

filter.addEventListener("click", () => {
  dropDown.classList.toggle("show-drop-down");
});


let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    displayFilteredAbilities(searchInput.value.trim());
  }, 300); 
});


abilitiesContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let pokemonAbilityNameOrID = event.target.innerHTML;
    pokemonAbilityNameOrID = pokemonAbilityNameOrID.includes("Ab.")
      ? pokemonAbilityNameOrID.split(" ")[1]
      : pokemonAbilityNameOrID.split(" ").join("-");
    sessionStorage.setItem("pokemonAbilityName", pokemonAbilityNameOrID);
    const pkmnColor = "white";
    sessionStorage.setItem("pkmnColor", pkmnColor);
    window.location.href =
      "../pokedex/detail/abilities/abilityDetails/abilityDetails.html";
  }
});


displayAllAbilities();
