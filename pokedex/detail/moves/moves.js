import rgbaColors from "../../../utils/rgbaColors.js";

const button = document.getElementsByTagName("button");
const backbtn = document.querySelector(".back");
const faSolid = document.querySelectorAll(".fa-solid");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const infoDiv = document.querySelector(".info-div")

const storedPkmnColor = sessionStorage.getItem("pkmnColor");

for (let btn of button) {
  btn.style.border = `0.3rem ridge ${storedPkmnColor}`;
  storedPkmnColor === "white"
    ? (btn.style.textShadow = `0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}, 0px 0px 2px ${storedPkmnColor}`)
    : storedPkmnColor === "yellow"
    ? (btn.style.textShadow = `0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}, 0px 0px 3px ${storedPkmnColor}`)
    : (btn.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`);
  btn.style.background = rgbaColors[storedPkmnColor];
}

for (let fa of faSolid) {
  fa.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;
}

infoDiv.style.textShadow = `0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}, 0px 0px 15px ${storedPkmnColor}`;

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
