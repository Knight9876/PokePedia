const locationContainer = document.querySelector(".location");
const backbtn = document.querySelector(".back");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".main-container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const searchInput = document.getElementById("search-input");
const dropDown = document.getElementById("drop-down");
const clearSearchInput = document.getElementById("clear-search-input");
const alllocation = document.getElementById("allLocation");


function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}


function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}

let allLocation = [];


async function fetchAndDisplayLocation() {
  try {
    const locationResponse = await fetch(
      "https://pokeapi.co/api/v2/location-area?limit=10000"
    ); 
    const locationData = await locationResponse.json();

    allLocation = locationData.results.map((location) => {
        const locationId = location.url.split("/")[6]
      return {
        name : location.name,
        id: locationId
      };
    });

    displayFilteredLocations("");
    
  } catch (error) {
    console.error("Error fetching locations:", error);
    locationContainer.innerHTML = "<p>Failed to load locations.</p>";
  }
}


function displayFilteredLocations(query) {
  const filteredLocations = allLocation.filter((location) =>
    location.name.toLowerCase().includes(query.toLowerCase()) || location.id.includes(query)
  );

  let locationsHtml = "";
  filteredLocations.forEach((location) => {
    locationsHtml += `
      <div class="location-container">
        <p class="location-id">Loc. ${location.id}</p>
        <p class="location-name">${location.name.split("-").join(" ")}</p>
      </div>
    `;
  });

  locationContainer.innerHTML = locationsHtml;
}

async function handleGenChange() {
  showLoader(); 
  if (alllocation.checked) {
    await fetchAndDisplayLocation(); 
  }
  hideLoader();
  
  searchInput.value = "";
  dropDown.classList.toggle("show-drop-down");
}

alllocation.addEventListener("change", handleGenChange);

locationContainer.style.setProperty("--scrollbar-thumb-color", "white");
locationContainer.style.setProperty("--scrollbar-track-color", "grey");


let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    displayFilteredLocations(searchInput.value.trim());
  }, 300); 
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

backbtn.addEventListener("click", () => (window.location.href = "../"));

filter.addEventListener("click", () => {
  dropDown.classList.toggle("show-drop-down");
});

locationContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let pokemonLocation = event.target.innerHTML;
    pokemonLocation = pokemonLocation.includes("Loc.") ? pokemonLocation.split(" ")[1] : pokemonLocation.split(" ").join("-");
    sessionStorage.setItem("pokemonLocation", pokemonLocation);
    const pkmnColor = "white";
    sessionStorage.setItem("pkmnColor", pkmnColor);
    const pokemonName = "N/A"
    sessionStorage.setItem("pokemonName", pokemonName)
    window.location.href =
      "../pokedex/detail/location/locationDetails/locationDetails.html";
  }
});

clearSearchInput.addEventListener("click", () => {
  searchInput.value = "";
  start();
});

let selectedFilter = "allLocation";

const start = () => {
  if (selectedFilter || searchInput.value === "") {
    
    document.getElementById(selectedFilter).checked = true;
    dropDown.classList.toggle("show-drop-down");
    handleGenChange();
  }
};

start();
