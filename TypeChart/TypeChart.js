const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const backbtn = document.querySelector(".back");

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
