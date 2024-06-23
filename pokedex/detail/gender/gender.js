const storedPokemonName = sessionStorage.getItem("pokemonName");
const storedPkmnColor = sessionStorage.getItem("pkmnColor");

const male = document.getElementById("male");
const shinyMale = document.querySelector(".shiny-male");
const female = document.getElementById("female");
const shinyFemale = document.querySelector(".shiny-female");
const gender = document.getElementById("gender");
const fa = document.querySelectorAll(".fa-solid");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const backbtn = document.querySelector(".back");

let shiny = false;

gender.style.textShadow = `0 0 ${
  storedPkmnColor === "white" || storedPkmnColor === "yellow" ? "1px" : "10px"
} ${storedPkmnColor}, 0 0 ${
  storedPkmnColor === "white" || storedPkmnColor === "yellow" ? "1px" : "10px"
} ${storedPkmnColor}, 0 0 ${
  storedPkmnColor === "white" || storedPkmnColor === "yellow" ? "1px" : "10px"
} ${storedPkmnColor}, 0 0 ${
  storedPkmnColor === "white" || storedPkmnColor === "yellow" ? "1px" : "10px"
} ${storedPkmnColor}`;

for (const f of fa) {
  f.style.textShadow = `0 0 ${
    storedPkmnColor === "white" || storedPkmnColor === "yellow" ? "1px" : "10px"
  } ${storedPkmnColor}, 0 0 ${
    storedPkmnColor === "white" || storedPkmnColor === "yellow" ? "1px" : "10px"
  } ${storedPkmnColor}, 0 0 ${
    storedPkmnColor === "white" || storedPkmnColor === "yellow" ? "1px" : "10px"
  } ${storedPkmnColor}, 0 0 ${
    storedPkmnColor === "white" || storedPkmnColor === "yellow" ? "1px" : "10px"
  } ${storedPkmnColor}`;
}

async function getSprites() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${storedPokemonName}`
    );
    const data = await response.json();
    console.log(data.sprites);
    male.src = `../../../assets/pokemon-images-normal/${storedPokemonName}.png`;
    male.onerror = function () {
      this.onerror = null;
      this.src = data.sprites.front_default;
    };
    female.src = `../../../assets/pokemon-images-normal-female/${storedPokemonName}.png`;
    female.onerror = function () {
      this.onerror = null;
      this.src = `../../../assets/pokemon-images-normal/${storedPokemonName}.png`;
    };
  } catch (error) {
    console.error("Error fetching images !!!");
  }
}

getSprites();

shinyMale.addEventListener("click", () => {
  if (!shiny) {
    male.src = `../../../assets/pokemon-images-shiny/${storedPokemonName}.png`;
    shiny = true;
  } else {
    male.src = `../../../assets/pokemon-images-normal/${storedPokemonName}.png`;
    shiny = false;
  }
  console.log("clicked");
});

shinyFemale.addEventListener("click", () => {
  if (!shiny) {
    female.src = `../../../assets/pokemon-images-shiny-female/${storedPokemonName}.png`;
    female.onerror = function () {
      this.onerror = null;
      this.src = `../../../assets/pokemon-images-shiny/${storedPokemonName}.png`;
    };
    shiny = true;
  } else {
    female.src = `../../../assets/pokemon-images-normal-female/${storedPokemonName}.png`;
    female.onerror = function () {
      this.onerror = null;
      this.src = `../../../assets/pokemon-images-normal/${storedPokemonName}.png`;
    };
    shiny = false;
  }
  console.log("clicked");
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

backbtn.addEventListener("click", () => (window.location.href = "../detail.html"));