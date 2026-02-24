// Selectors
const navButtons = document.querySelectorAll("#nav button");
const headerItems = document.querySelectorAll("#header-items button");
const searchInput = document.querySelector("#search-input input");
const searchCategories = document.querySelectorAll("#search-categories button");
const locationButton = document.querySelector("#location button");
const alsoLikeItems = document.querySelectorAll("#also-like-items button");

// Event Listeners
navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Toggle active class on navigation buttons
    navButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

headerItems.forEach((button) => {
  button.addEventListener("click", () => {
    // Toggle active class on header items
    headerItems.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

searchInput.addEventListener("input", () => {
  // Filter search results based on input value
  const inputValue = searchInput.value.toLowerCase();
  searchCategories.forEach((button) => {
    const buttonText = button.textContent.toLowerCase();
    if (buttonText.includes(inputValue)) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });
});

locationButton.addEventListener("click", () => {
  // Toggle location dropdown
  const locationDropdown = document.querySelector("#location-dropdown");
  locationDropdown.classList.toggle("show");
});

alsoLikeItems.forEach((button) => {
  button.addEventListener("click", () => {
    // Add to cart or wishlist functionality
    console.log("Add to cart or wishlist");
  });
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation buttons
  navButtons[0].classList.add("active");

  // Initialize header items
  headerItems[0].classList.add("active");
});
// Selectors
const images = document.querySelectorAll("img");

// Add touch events to images
images.forEach((image) => {
  image.addEventListener("touchstart", (event) => {
    // Get the touch coordinates
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    // Add a class to the image to indicate it's being touched
    image.classList.add("touched");
  });

  image.addEventListener("touchmove", (event) => {
    // Get the touch coordinates
    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;

    // Update the image position based on the touch movement
    image.style.transform = `translate(${touchX}px, ${touchY}px)`;
  });

  image.addEventListener("touchend", () => {
    // Remove the class from the image to indicate it's no longer being touched
    image.classList.remove("touched");
  });
});
