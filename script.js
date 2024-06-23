const power = document.querySelector(".fa-power-off");
const pokedex = document.querySelector(".pokedex");
const btns = document.querySelector(".btns");
const info = document.querySelector(".info");
const about = document.querySelector(".about");
const pokedexBackground = document.querySelector(".pokedex-background")
const pokeball = document.querySelector(".pokeball")

let isOpen = sessionStorage.getItem("isOpen")
isOpen = JSON.parse(isOpen) || false

if (isOpen) {
  pokedex.style.height = "56rem";
  btns.style.visibility = "visible";
  pokedexBackground.style.background = "rgba(0, 255, 255, 0.3)"
  pokeball.style.visibility = "hidden"
}

power.addEventListener("click", () => {
  
  if (pokedex.style.height === "30rem") {
    pokedex.style.height = "56rem";
    setTimeout(() => {
      btns.style.visibility = "visible";
      isOpen = true
      sessionStorage.setItem("isOpen", isOpen)
    }, 300);
    pokedexBackground.style.background = "rgba(0, 255, 255, 0.3)"
    pokeball.style.visibility = "hidden"
  } else {
    pokedex.style.height = "30rem";
    btns.style.visibility = "hidden";
    pokedexBackground.style.background = "rgba(0, 255, 255)"
    pokeball.style.visibility = "visible"
    isOpen = false
    sessionStorage.setItem("isOpen", isOpen)
  }
  
  if (about.style.visibility === "visible") {
    about.style.visibility = "hidden";
    pokedex.style.height = "30rem";
    setTimeout(() => {
      setTimeout(() => {
        btns.style.visibility = "visible";
        isOpen = true
        sessionStorage.setItem("isOpen", isOpen)
      }, 300);
      pokedex.style.height = "56rem";
      pokedexBackground.style.background = "rgba(0, 255, 255, 0.3)"
      pokeball.style.visibility = "hidden"
    }, 600);
  }
});

info.addEventListener("click", () => {
  if (btns.style.visibility === "visible") {
    btns.style.visibility = "hidden";
    pokedex.style.height = "30rem";
    pokedexBackground.style.background = "rgba(0, 255, 255)"
    pokeball.style.visibility = "visible"
    setTimeout(() => {
      setTimeout(() => {
        about.style.visibility = "visible";
      }, 300);
      pokedexBackground.style.background = "rgba(0, 255, 255, 0.3)"
      pokeball.style.visibility = "hidden"
      pokedex.style.height = "56rem";
    }, 600);
  }
  else if (about.style.visibility !== "visible") {
    pokedex.style.height = "56rem";
    setTimeout(() => {
      about.style.visibility = "visible";
      pokedexBackground.style.background = "rgba(0, 255, 255, 0.3)"
      pokeball.style.visibility = "hidden"
    }, 300);
  } else {
    pokedex.style.height = "30rem"
    about.style.visibility = "hidden";
    pokedexBackground.style.background = "rgba(0, 255, 255)"
    pokeball.style.visibility = "visible"
  }
});
