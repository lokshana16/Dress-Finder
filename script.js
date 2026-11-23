const fileInput = document.querySelector("#file-input");
const chooseButton = document.querySelector("#choose-button");
const dropZone = document.querySelector("#drop-zone");
const preview = document.querySelector("#preview");
const emptyState = document.querySelector("#upload-empty");
const removeButton = document.querySelector("#remove-photo");
const description = document.querySelector("#description");
const searchButton = document.querySelector("#search-button");
const results = document.querySelector("#results");
const storeGrid = document.querySelector("#store-grid");
const queryLabel = document.querySelector("#query-label");
const toast = document.querySelector("#toast");

let currentImageUrl = null;
let toastTimer;

const stores = [
  { name: "AJIO", mark: "A", color: "#292929", url: query => `https://www.ajio.com/search/?text=${query}` },
  { name: "Myntra", mark: "M", color: "#ed3f73", url: query => `https://www.myntra.com/${query}` },
  { name: "Amazon", mark: "a", color: "#f1a12b", url: query => `https://www.amazon.in/s?k=${query}` },
  { name: "Flipkart", mark: "F", color: "#2874f0", url: query => `https://www.flipkart.com/search?q=${query}` }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function updateSearchButton() {
  searchButton.disabled = !description.value.trim();
}

function loadImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    showToast("Please choose an image file.");
    return;
  }

  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
  currentImageUrl = URL.createObjectURL(file);
  preview.src = currentImageUrl;
  preview.hidden = false;
  emptyState.hidden = true;
  removeButton.hidden = false;
}

function removeImage() {
  if (currentImageUrl) URL.revokeObjectURL(currentImageUrl);
  currentImageUrl = null;
  preview.removeAttribute("src");
  preview.hidden = true;
  emptyState.hidden = false;
  removeButton.hidden = true;
}

chooseButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", event => loadImage(event.target.files[0]));
removeButton.addEventListener("click", () => {
  removeImage();
  fileInput.value = "";
});
description.addEventListener("input", updateSearchButton);

for (const eventName of ["dragenter", "dragover"]) {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
}
for (const eventName of ["dragleave", "drop"]) {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
  });
}
dropZone.addEventListener("drop", event => loadImage(event.dataTransfer.files[0]));

searchButton.addEventListener("click", () => {
  const searchTerm = description.value.trim();
  if (!searchTerm) return;

  const encodedTerm = encodeURIComponent(searchTerm);
  queryLabel.textContent = `Searching for “${searchTerm}”`;
  storeGrid.replaceChildren();

  stores.forEach(store => {
    const link = document.createElement("a");
    link.className = "store-card";
    link.href = store.url(encodedTerm);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = `
      <span class="store-top">
        <span class="store-logo" style="background:${store.color}">${store.mark}</span>
        <span class="store-arrow" aria-hidden="true">↗</span>
      </span>
      <span class="store-name">${store.name}</span>
      <span class="store-action">Search similar dresses</span>
    `;
    storeGrid.append(link);
  });

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});
