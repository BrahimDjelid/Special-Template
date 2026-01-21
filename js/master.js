/* GLASS MODE TOGGLE (LANDING vs SECTIONS) */
const landingSection = document.querySelector(".landing-page");

// Settings box
const settingsIcon = document.querySelector(".toggle-button .settings-button");
const toggleButton = document.querySelector(".toggle-button");
const settingsBox = document.querySelector(".settings-box");

// Colors
const colorLi = document.querySelectorAll(".colors-list li");

// Background
const landingPage = document.querySelector(".landing-page");
const randomBgButton = document.querySelectorAll(
  ".options-box .random-bg-button",
);

// Bullets Buttons
let bulletsButtons = document.querySelectorAll(".bullets-button");
let bulletsContainer = document.querySelector(".nav-bullets");

// variables
let randomBackgroundOption = true;
let backgroundInterval;
let currentImageIndex = 0;
let feedbackTimeout;
let feedbackTimeoutIcon;

// Images array
const imgs = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
];

// Skills
let ourSkills = document.querySelector(".skills");

// Gallery Images
let ourGallery = document.querySelectorAll(".gallery img");

// Handle mode
function handleGlassMode() {
  const landingBottom = landingSection.offsetTop + landingSection.offsetHeight;
  const scrollY = window.pageYOffset;

  // While landing page is visible
  if (scrollY < landingBottom - 155) {
    document.body.classList.add("landing-mode");
    document.body.classList.remove("content-mode");
  } else {
    document.body.classList.add("content-mode");
    document.body.classList.remove("landing-mode");
  }
}

// Run on load and on scroll
window.addEventListener("scroll", handleGlassMode);
window.addEventListener("load", handleGlassMode);

// Handle Active State
function handleActive(event) {
  event.target.parentElement.querySelectorAll(".active").forEach((element) => {
    element.classList.remove("active");
  });
  event.target.classList.add("active");
}

/*  Settings box  */

// Toggle settings box open/close
function toggleSettings() {
  settingsBox.classList.toggle("active");
  settingsIcon.classList.toggle("fa-spin");
}

toggleButton.addEventListener("click", toggleSettings);

document.addEventListener("click", (e) => {
  if (!toggleButton.contains(e.target) && !settingsBox.contains(e.target)) {
    settingsBox.classList.remove("active");
    settingsIcon.classList.remove("fa-spin");
  }
});
/*  Color switcher  */

// Convert hex color to rgb format
// Example: #38e8d0 -> "56, 232, 208"
function hexToRgb(hex) {
  return hex
    .replace("#", "") // Remove #
    .match(/.{2}/g) // Split into pairs ["38", "e8", "d0"]
    .map((x) => parseInt(x, 16)) // Convert to decimal [56, 232, 208]
    .join(", "); // Join with commas into one string "56, 232, 208"
}

// Update website colors
function updateThemeColor(color) {
  const rgb = hexToRgb(color);

  document.documentElement.style.setProperty("--primary", color);
  document.documentElement.style.setProperty("--primary-rgb", rgb);

  localStorage.setItem("primary", color);
  localStorage.setItem("primary-rgb", rgb);
}

// Handle color change when clicking a color
function handleColorChange(event) {
  handleActive(event);
  // Remove active from all colors
  // colorLi.forEach((el) => el.classList.remove("active"));

  // Add active to clicked color
  // event.target.classList.add("active");

  // Get color value
  const color = event.target.dataset.color;

  // Update the color
  updateThemeColor(color);

  // Close settings box
  toggleSettings();
}

// Add click event to each color
colorLi.forEach((li) => {
  li.addEventListener("click", handleColorChange);
});

/*  BACKGROUND SLIDER  */

// Change background image every 10 seconds
function randomBackgrounds() {
  clearInterval(backgroundInterval);
  if (randomBackgroundOption === true) {
    backgroundInterval = setInterval(() => {
      // Pick random image
      currentImageIndex = Math.floor(Math.random() * imgs.length);

      // Apply it as background
      landingPage.style.backgroundImage = `url("imgs/${imgs[currentImageIndex]}")`;

      // Save current image index
      localStorage.setItem("backgroundImageIndex", currentImageIndex);
    }, 10000);
  } else {
    clearInterval(backgroundInterval);
  }
}

// Handle feedback message when changing the option
function showFeedback(message, iconClass, type) {
  // Get feedback elements
  let feedback = document.querySelector(".feedback");
  let feedbackIcon = document.querySelector(".feedback-icon");
  let feedbackMsg = document.querySelector(".feedback-text");

  feedbackMsg.textContent = message;
  feedbackIcon.innerHTML = `<i class="${iconClass}"></i>`;

  feedback.classList.remove("show", "success", "info");

  setTimeout(() => {
    feedback.classList.add("show", type);
  }, 10);

  clearTimeout(feedbackTimeout); // For multiple clicks ex yes then no, this ensures that the previous timeout is delete it so next when you create another timeout it starts from 0
  clearTimeout(feedbackTimeoutIcon); // Because when the timeout ends, the color of the icon color returns to white so use another timeout for it

  feedbackTimeout = setTimeout(() => {
    feedback.classList.remove("show"); // remove only show first then after 1s remove success and info, this way keep the color of the icon on the screen after the first time out end
    feedbackTimeoutIcon = setTimeout(() => {
      feedback.classList.remove("success", "info");
    }, 4000);
  }, 3000);
}

// Handle Yes/No button clicks
function handleBackgroundToggle(event) {
  handleActive(event);
  // Remove active from all buttons
  // randomBgButton.forEach((button) => {
  //   button.classList.remove("active");
  // });

  // Add active to clicked button
  // event.target.classList.add("active");

  // Check if Yes or No was clicked
  if (event.target.dataset.background === "yes") {
    randomBackgroundOption = true;
    localStorage.setItem("randomBgOption", true);
    randomBackgrounds();
    showFeedback(
      "Random Background Active!",
      "fa-regular fa-circle-check",
      "success",
    );
  } else {
    randomBackgroundOption = false;
    localStorage.setItem("randomBgOption", false);
    // Save current image when stopping slider
    localStorage.setItem("backgroundImageIndex", currentImageIndex);
    clearInterval(backgroundInterval);
    showFeedback("Background Locked!", "fa-regular fa-circle-xmark", "info");
  }

  // Close settings box
  toggleSettings();
}

// Add click event to Yes/No buttons
randomBgButton.forEach((button) => {
  button.addEventListener("click", handleBackgroundToggle);
});

/* Handle Bullets Option*/

bulletsButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    if (event.target.dataset.display === "show") {
      bulletsContainer.style.display = "block";
      localStorage.setItem("bullets", "show");
    } else {
      bulletsContainer.style.display = "none";
      localStorage.setItem("bullets", "hide");
    }
    handleActive(event);
    toggleSettings();
  });
});

/*  LOAD SAVED COLOR  */

// Load color from localStorage when page loads
function loadSavedColor() {
  const savedColor = localStorage.getItem("primary");
  const savedRgb = localStorage.getItem("primary-rgb");

  if (savedColor && savedRgb) {
    // Apply saved color
    document.documentElement.style.setProperty("--primary", savedColor);
    document.documentElement.style.setProperty("--primary-rgb", savedRgb);

    // Mark the saved color as active
    colorLi.forEach((li) => {
      li.classList.remove("active");

      if (li.dataset.color === savedColor) {
        li.classList.add("active");
      }
    });
  }
}

/*  LOAD SAVED BACKGROUND IMAGE  */

// Load this BEFORE starting the slider to prevent flicker
function loadSavedBackgroundImage() {
  const savedIndex = localStorage.getItem("backgroundImageIndex");

  if (savedIndex !== null) {
    currentImageIndex = parseInt(savedIndex);
    landingPage.style.backgroundImage = `url("imgs/${imgs[currentImageIndex]}")`;
  } else {
    currentImageIndex = 0;
    landingPage.style.backgroundImage = `url("imgs/1.jpg")`;
  }
}

/*  LOAD SAVED BACKGROUND OPTION  */

// Load background setting from localStorage
function loadSavedBackgroundOption() {
  const randomBgValue = localStorage.getItem("randomBgOption");

  if (randomBgValue !== null) {
    // Remove active from all buttons
    randomBgButton.forEach((button) => {
      button.classList.remove("active");
    });

    // Apply saved setting
    if (randomBgValue === "true") {
      randomBackgroundOption = true;
      document.querySelector(".random-bg-button.yes").classList.add("active");
    } else {
      randomBackgroundOption = false;
      document.querySelector(".random-bg-button.no").classList.add("active");
    }
  }
}

// Load Bullets State
function loadBulletsState() {
  const state = localStorage.getItem("bullets");

  if (state) {
    if (state === "show") {
      bulletsContainer.style.display = "block";
    } else {
      bulletsContainer.style.display = "none";
    }

    bulletsButtons.forEach((button) => {
      button.classList.remove("active");

      if (button.dataset.display === state) {
        button.classList.add("active");
      }
    });
  }
}

loadSavedColor();
loadSavedBackgroundImage();
loadSavedBackgroundOption();
loadBulletsState();

/*  Start background slider  */
if (randomBackgroundOption === true) {
  randomBackgrounds();
}

// Reset Button
const localStorageItems = [
  "primary",
  "primary-rgb",
  "randomBgOption",
  "backgroundImageIndex",
  "bullets",
];

document.querySelector(".reset-button").onclick = function () {
  localStorageItems.forEach((item) => {
    localStorage.removeItem(item);
  });

  window.location.reload();
};

// Select Skills Selector
window.onscroll = function () {
  // Skills Offset Top
  let skillsOffsetTop = ourSkills.offsetTop;

  // Skills Outer Height
  let skillsOuterHeight = ourSkills.offsetHeight;

  // Window height
  let windowHeight = this.innerHeight;

  // Window ScrollTop
  let windowScrollTop = this.pageYOffset;

  if (windowScrollTop > skillsOffsetTop + skillsOuterHeight - windowHeight) {
    let allSkills = this.document.querySelectorAll(
      ".skill-box .skill-progress span",
    );

    allSkills.forEach((skill) => {
      skill.style.width = skill.dataset.progress;
    });
  }
};

// Create pop up with the image

ourGallery.forEach((img) => {
  img.addEventListener("click", () => {
    // Create overlay element
    let overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    document.body.appendChild(overlay);

    // Create the popup
    let popupBox = document.createElement("div");
    popupBox.className = "popup-box";

    if (img.alt !== null && img.alt !== "") {
      let imageHeading = document.createElement("h3");
      // Get The alt text
      let headingText = document.createTextNode(img.alt);

      imageHeading.appendChild(headingText);
      popupBox.appendChild(imageHeading);
    }

    // Create The Image
    let popupImage = document.createElement("img");
    // set image source
    popupImage.src = img.src;

    popupBox.appendChild(popupImage);
    document.body.appendChild(popupBox);

    // Create Close span
    let closeButton = document.createElement("span");
    closeButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    // closeButton.innerHTML = `X`;
    closeButton.className = "close-button";

    popupBox.appendChild(closeButton);
  });
});

// close popup
document.addEventListener("click", (event) => {
  if (event.target.className == "close-button") {
    event.target.parentNode.remove();
    document.querySelector(".popup-overlay").remove();
  } else if (event.target.classList.contains("fa-xmark")) {
    event.target.parentNode.parentNode.remove();
    document.querySelector(".popup-overlay").remove();
  }
});

// scroll to section
const bullets = document.querySelectorAll(".nav-bullets .bullet");
const links = document.querySelectorAll(".links a");

function scrollToSection(elements) {
  elements.forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector(event.target.dataset.section).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
}

scrollToSection(bullets);
scrollToSection(links);

// toggle menu
let toggleMenu = document.querySelector(".toggle-menu");
let linksOpened = document.querySelector(".links");

toggleMenu.addEventListener("click", () => {
  linksOpened.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!toggleMenu.contains(e.target) && !linksOpened.contains(e.target)) {
    linksOpened.classList.remove("open");
  }
});
