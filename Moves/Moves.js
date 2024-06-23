const movesContainer = document.getElementById("moves");
const backbtn = document.querySelector(".back");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const searchInput = document.getElementById("search-input");
const dropDown = document.getElementById("drop-down");
const clearSearchInput = document.getElementById("clear-search-input");
const allmoves = document.getElementById("allMoves");
const tm = document.getElementById("tm");
const hm = document.getElementById("hm");
const Status = document.getElementById("status");
const physical = document.getElementById("physical");
const special = document.getElementById("special");


function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}


function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}

let allMoves = [];
let tmMoves = [];

const hmMovesNameForComparing = [
  "cut",
  "fly",
  "surf",
  "strength",
  "flash",
  "rock-smash",
  "waterfall",
  "dive",
  "defog",
  "rock-climb",
];
const hmMovesNameForDisplay = [
  "cut",
  "fly",
  "surf",
  "strength",
  "flash",
  "rock-smash",
  "waterfall",
  "dive",
];


async function fetchAndDisplayMoves() {
  try {
    const movesResponse = await fetch(
      "https://pokeapi.co/api/v2/move?limit=10000"
    ); 
    const movesData = await movesResponse.json();

    allMoves = movesData.results.map((move) => {
      const moveId = move.url
        .split("/")
        .filter((part) => part)
        .pop(); 
      return {
        id: moveId,
        name: move.name,
        url: move.url,
      };
    });

    displayFilteredMoves("");
    
  } catch (error) {
    console.error("Error fetching moves:", error);
    movesContainer.innerHTML = "<p>Failed to load moves.</p>";
  }
}


function displayFilteredMoves(query) {
  const filteredMoves = allMoves.filter(
    (move) =>
      move.name.toLowerCase().includes(query.toLowerCase()) ||
      move.id.includes(query)
  );

  let movesHtml = "";
  filteredMoves.forEach((move) => {
    movesHtml += `
      <div class="move-container">
        <p class="move-id">Mv. ${move.id}</p>
        <p class="move-name">${move.name.split("-").join(" ")}</p>
      </div>
    `;
  });

  movesContainer.innerHTML = movesHtml;
}


async function fetchTMMoves() {
  const tmPromises = allMoves.map(async (move) => {
    try {
      const moveResponse = await fetch(move.url);
      const moveData = await moveResponse.json();

      if (
        moveData.machines.length > 0 &&
        !hmMovesNameForComparing.includes(moveData.name)
      ) {
        const machineUrl = moveData.machines[0].machine.url;
        const machineResponse = await fetch(machineUrl);
        const machineData = await machineResponse.json();
        const tmName = machineData.item.name;

        tmMoves.push({
          name: move.name,
          tm: tmName,
        });
      }
    } catch (error) {
      console.error(`Error fetching data for move ${move.name}:`, error);
    }
  });

  await Promise.all(tmPromises);

  
  tmMoves.sort((a, b) => {
    const tmNumberA = parseInt(a.tm.match(/\d+/)[0], 10);
    const tmNumberB = parseInt(b.tm.match(/\d+/)[0], 10);
    return tmNumberA - tmNumberB;
  });
}

async function displayTmMoves() {
  await fetchTMMoves();

  let movesHtml = "";
  tmMoves.forEach((move) => {
    movesHtml += `
      <div class="move-container">
        <p class="move-id">${move.tm}</p>
        <p class="move-name">${move.name.split("-").join(" ")}</p>
      </div>
    `;
  });

  movesContainer.innerHTML = movesHtml;
}

function displayHmMoves() {
  let movesHtml = "";
  for (let hm in hmMovesNameForDisplay) {
    movesHtml += `
      <div class="move-container">
      <p class="move-id">HM0${Number(hm) + 1}</p>
      <p class="move-name">${hmMovesNameForDisplay[hm].split("-").join(" ")}</p>
      </div>
      `;
  }
  movesContainer.innerHTML = movesHtml;
}


async function displayMovesByDamageClass(damageClassName) {
  const filteredMoves = [];

  for (let move of allMoves) {
    const moveDetails = await fetch(move.url);
    const moveResponse = await moveDetails.json();
    if (
      moveResponse &&
      moveResponse.damage_class &&
      moveResponse.damage_class.name === damageClassName
    ) {
      filteredMoves.push(moveResponse);
    }
  }

  let movesHtml = "";
  filteredMoves.forEach((move) => {
    movesHtml += `
      <div class="move-container">
        <p class="move-id">Mv. ${move.id}</p>
        <p class="move-name">${move.name.split("-").join(" ")}</p>
      </div>
    `;
  });

  movesContainer.innerHTML = movesHtml;
}

async function handleGenChange() {
  let selectedFilter = "";
  showLoader(); 
  if (allmoves.checked) {
    selectedFilter = "allMoves";
    await fetchAndDisplayMoves(); 
  } else if (tm.checked) {
    selectedFilter = "tm";
    await displayTmMoves();
  } else if (hm.checked) {
    selectedFilter = "hm";
    displayHmMoves();
  } else if (Status.checked) {
    selectedFilter = "status";
    await displayMovesByDamageClass("status");
  } else if (physical.checked) {
    selectedFilter = "physical";
    await displayMovesByDamageClass("physical");
  } else if (special.checked) {
    selectedFilter = "special";
    await displayMovesByDamageClass("special");
  }
  hideLoader();
  
  sessionStorage.setItem("selectedFilter", selectedFilter);
  searchInput.value = "";
  dropDown.classList.toggle("show-drop-down");
}

allmoves.addEventListener("change", handleGenChange);
tm.addEventListener("change", handleGenChange);
hm.addEventListener("change", handleGenChange);
Status.addEventListener("change", handleGenChange);
physical.addEventListener("change", handleGenChange);
special.addEventListener("change", handleGenChange);

movesContainer.style.setProperty("--scrollbar-thumb-color", "white");
movesContainer.style.setProperty("--scrollbar-track-color", "grey");


let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    displayFilteredMoves(searchInput.value.trim());
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

backbtn.addEventListener(
  "click",
  () => (window.location.href = "../")
);

filter.addEventListener("click", () => {
  dropDown.classList.toggle("show-drop-down");
});

movesContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let pokemonMoveNameOrID = event.target.innerHTML;
    pokemonMoveNameOrID = pokemonMoveNameOrID.includes("Mv.")
      ? pokemonMoveNameOrID.split(" ")[1]
      : pokemonMoveNameOrID.split(" ").join("-");
    sessionStorage.setItem("pokemonMoveNameOrId", pokemonMoveNameOrID);
    const pkmnColor = "white";
    sessionStorage.setItem("pkmnColor", pkmnColor);
    window.location.href =
      "../pokedex/detail/moves/moveDetails/moveDetails.html";
  }
});

clearSearchInput.addEventListener("click", () => {
  searchInput.value = "";
  start();
});

let selectedFilter = "allMoves";

const start = () => {
  if (selectedFilter || searchInput.value === "") {
    
    document.getElementById(selectedFilter).checked = true;
    dropDown.classList.toggle("show-drop-down");
    handleGenChange();
  }
};

start();
