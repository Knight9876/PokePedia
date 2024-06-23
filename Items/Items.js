const ItemsContainer = document.querySelector(".items");
const backbtn = document.querySelector(".back");
const loader = document.getElementById("loader");
const mainContainer = document.querySelector(".main-container");
const openMenu = document.getElementById("open-menu");
const menuList = document.getElementById("menu-list");
const closeMenu = document.getElementById("close-menu");
const searchInput = document.getElementById("search-input");
const dropDown = document.getElementById("drop-down");
const clearSearchInput = document.getElementById("clear-search-input");
const allitems = document.getElementById("allItems");
const countable = document.getElementById("countable");
const consumable = document.getElementById("consumable");
const usable = document.getElementById("usable");
const holdable = document.getElementById("holdable");
const underground = document.getElementById("underground");
const popUp = document.getElementById("pop-up");
const popUpWindow = document.getElementById("pop-up-window");


function showLoader() {
  loader.style.visibility = "visible";
  mainContainer.style.visibility = "hidden";
}


function hideLoader() {
  loader.style.visibility = "hidden";
  mainContainer.style.visibility = "visible";
}

let allItems = [];
let allAttributes = [];

const attributeGroups = {
  holdable: ["holdable", "holdable-passive", "holdable-active"],
  usable: ["usable-overworld", "usable-in-battle"],
  consumable: ["consumable"],
  countable: ["countable"],
  underground: ["underground"],
};

async function fetchAttributes() {
  const response = await fetch("https://pokeapi.co/api/v2/item-attribute/");
  const data = await response.json();
  allAttributes = data.results;
  fetchAndDisplayItems();
}

async function fetchAndDisplayItems() {
  try {
    const itemsResponse = await fetch(
      "https://pokeapi.co/api/v2/item?limit=3000"
    ); 
    const itemsData = await itemsResponse.json();

    allItems = itemsData.results.map((item) => {
      const itemId = item.url.split("/")[6]; 
      return {
        id: itemId,
        name: item.name,
        url: item.url,
      };
    });

    displayFilteredItems("");
  } catch (error) {
    console.error("Error fetching items:", error);
    ItemsContainer.innerHTML = "<p>Failed to load items.</p>";
  }
}

function displayFilteredItems(query) {
  let filteredItems = [];
  
  if (typeof query === 'string') {
    filteredItems = allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.id.includes(query)
    );
  } else if (Array.isArray(query)) {
    filteredItems = query;
  }

  let itemsHtml = "";
  filteredItems.forEach((item) => {
    itemsHtml += `
      <div class="items-container">
        <p class="item-id">It. ${item.id}</p>
        <p class="item-name">${item.name.split("-").join(" ")}</p>
      </div>
    `;
  });

  ItemsContainer.innerHTML = itemsHtml;
}

function groupAttributes() {
  const groupedAttributes = {};

  for (const group in attributeGroups) {
    attributeGroups[group].forEach((attrName) => {
      const attribute = allAttributes.find((attr) => attr.name === attrName);
      if (attribute) {
        if (!groupedAttributes[group]) {
          groupedAttributes[group] = [];
        }
        groupedAttributes[group].push(attribute.url);
      }
    });
  }

  return groupedAttributes;
}


async function fetchItemsInBatches(items, batchSize = 100) {
  const batchedItems = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(async (item) => {
      try {
        const response = await fetch(item.url);
        const itemData = await response.json();
        return itemData;
      } catch (error) {
        console.error(`Error fetching item ${item.name}:`, error);
        return null;
      }
    });
    const batchResults = await Promise.all(batchPromises);
    batchedItems.push(...batchResults.filter(item => item !== null));
  }
  return batchedItems;
}

async function filterItemsByAttribute(group) {
  const groupedAttributes = groupAttributes();
  const attributeUrls = groupedAttributes[group];

  const itemsData = await fetchItemsInBatches(allItems);

  const filteredItems = itemsData.filter((itemData) => {
    const itemAttributes = itemData.attributes.map(attr => attr.url);
    return attributeUrls.some(url => itemAttributes.includes(url));
  });

  const filteredItemsMapped = filteredItems.map(itemData => ({
    id: itemData.id,
    name: itemData.name,
    url: itemData.url
  }));

  displayFilteredItems(filteredItemsMapped);
}

async function displayItemDetails(methodName) {
  loader.style.visibility = "visible";
  mainContainer.scrollTo({ top: 0, behavior: "smooth" });
  mainContainer.style.overflow = "hidden";
  await fetchItemsList(methodName);
  popUp.style.visibility = "visible";
  popUp.classList.toggle("show-pop-up");
  loader.style.visibility = "hidden";
}

async function fetchItemsList(itemName) {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/item?limit=3000");
    const data = await response.json();
    handleItemClick(itemName, data.results);
  } catch (error) {
    popUp.style.visibility = "hidden";
    console.error("Error fetching items list:", error);
  }
}

async function handleItemClick(itemName, itemList) {
  const item = itemList.find((item) => item.name === itemName.toLowerCase());

  if (!item) {
    console.error("Item not found:", itemName);
    return;
  }

  try {
    const response = await fetch(item.url);
    const itemResponse = await response.json();
    itemDetails(itemResponse);
  } catch (error) {
    console.error("Error fetching item details:", error);
    popUpWindow.innerHTML = `
          <button type="button"><i class="fa-solid fa-xmark close-pop-up"></i></button>
          <p>No Details Found.</p>
          `;
  }
}

function itemDetails(itemDetails) {
  
  popUpWindow.innerHTML = `
        <button><i class="fa-solid fa-xmark close-pop-up"></i></button>
          <div class="pop-up-content">
            <img src="${itemDetails.sprites.default}" alt="${
    itemDetails.name
  }" style="border: 0.3rem ridge white; background: white;">
            <p>ID: ${itemDetails.id}</p>
            <p>Name: ${itemDetails.name.replace(/-/g, " ")}</p>
            <p>Category: ${itemDetails.category.name.replace(/-/g, " ")}</p>
            <p>Description: ${
              itemDetails.flavor_text_entries.length !== 0
                ? itemDetails.flavor_text_entries.find(
                    (entry) => entry.language.name === "en"
                  ).text
                : "N/A"
            }</p>
            <p>Effect: ${
              itemDetails.effect_entries.length !== 0
                ? itemDetails.effect_entries[0].short_effect
                : "N/A"
            }</p>
          </div>
        `;
}

async function handleGenChange() {
  showLoader(); 
  if (allitems.checked) {
    await fetchAndDisplayItems(); 
    } else if (consumable.checked) {
    await filterItemsByAttribute("consumable")
  } else if (countable.checked) {
    filterItemsByAttribute("countable")
  } else if (usable.checked) {
    await filterItemsByAttribute("usable")
  } else if (holdable.checked) {
    await filterItemsByAttribute("holdable")
  } else if (underground.checked) {
    await filterItemsByAttribute("underground")
  }
  hideLoader();
  
  searchInput.value = "";
  dropDown.classList.toggle("show-drop-down");
}

allitems.addEventListener("change", handleGenChange);
consumable.addEventListener("change", handleGenChange);
countable.addEventListener("change", handleGenChange);
usable.addEventListener("change", handleGenChange);
holdable.addEventListener("change", handleGenChange);
underground.addEventListener("change", handleGenChange);

ItemsContainer.style.setProperty("--scrollbar-thumb-color", "white");
ItemsContainer.style.setProperty("--scrollbar-track-color", "grey");


let debounceTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    displayFilteredItems(searchInput.value.trim());
  }, 300); 
});

ItemsContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    let itemName = event.target.innerHTML;
    itemName = itemName.includes("It.")
      ? itemName.split(" ")[1]
      : itemName.split(" ").join("-");
    displayItemDetails(itemName);
  }
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

clearSearchInput.addEventListener("click", () => {
  searchInput.value = "";
  start();
});

popUp.addEventListener("click", () => {
  mainContainer.style.overflow = "auto";
  popUp.classList.toggle("show-pop-up");
  popUp.style.visibility = "hidden";
});

let selectedFilter = "allItems";

const start = () => {
  if (selectedFilter || searchInput.value === "") {
    
    dropDown.classList.toggle("show-drop-down");
    handleGenChange();
  }
};

fetchAttributes();
start();
