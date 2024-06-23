import rgbaColors from "../../../utils/rgbaColors.js";

const storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");

const mainContainer = document.querySelector(".main-container");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const locationContainer = document.querySelector(".location");
const loader = document.getElementById("loader");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
menuList.style.border = `0.3rem ridge ${storedPkmnColor}`;
const closeMenu = document.getElementById("close-menu");

function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}

function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}

for (let btn of document.getElementsByTagName("button")) {
  btn.style.border = `0.3rem ridge ${
    storedPkmnColor === "black" ? "white" : storedPkmnColor
  }`;
  btn.style.background = rgbaColors[storedPkmnColor];
  btn.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
}

function shortenLocation(location) {
  const words = location.split("-");
  let shortenedLocation = words.slice(0, 3).join(" ");
  shortenedLocation =
    shortenedLocation.includes(" area") || shortenedLocation.includes(" main")
      ? shortenedLocation.replace(/ area| main/g, "")
      : shortenedLocation;
  return shortenedLocation;
}

for (let fa of faSolid) {
  fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
}

async function fetchLocations() {
  showLoader();
  try {
    const data = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${storedPokemonName}/encounters`
    );
    const locationData = await data.json();
    const locationArea = locationData.map((area) => {
      const shortenedArea = shortenLocation(area.location_area.name);
      return shortenedArea;
    });

    if (locationArea.length === 0) {
      locationContainer.innerHTML =
        "<p>This POKÉMON cannot be found or encountered.</p>";
    } else {
      locationArea.forEach((area) => {
        if (storedPkmnColor === "white") {
          locationContainer.innerHTML += `<p class="location-container" style="border: 0.3rem ridge ${storedPkmnColor}; text-shadow: 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}, 0 0 2px ${storedPkmnColor}; box-shadow: 0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]}";>${area}</p>`;
        } else if (storedPkmnColor === "yellow") {
          locationContainer.innerHTML += `<p class="location-container" style="border: 0.3rem ridge ${storedPkmnColor}; text-shadow: 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}, 0 0 3px ${storedPkmnColor}; box-shadow: 0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]}";>${area}</p>`;
        } else {
          locationContainer.innerHTML += `<p class="location-container" style="border: 0.3rem ridge ${storedPkmnColor}; text-shadow: 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}, 0 0 5px ${storedPkmnColor}; box-shadow: 0 0 10px ${storedPkmnColor}, 0 0 10px ${storedPkmnColor}; background: ${rgbaColors[storedPkmnColor]};">${area}</p>`;
        }
      });
    }
    hideLoader();
  } catch (error) {
    console.error(error);
    hideLoader();
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
  () => (window.location.href = "../detail.html")
);

locationContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let pokemonLocation = event.target.innerHTML.split(" ").join("-");
    sessionStorage.setItem("pokemonLocation", pokemonLocation);
    window.location.href = "./locationDetails/locationDetails.html";
  }
});

fetchLocations();
