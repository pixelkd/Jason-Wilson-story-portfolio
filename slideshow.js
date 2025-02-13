// slideshow.js

let currentImageIndex = 0; // Tracks the currently displayed image
let imageSequence = []; // Stores the current project's image sequence
let preloadedImages = {}; // Buffer for preloaded images

// Function to load slideshow components dynamically
function loadSlideshow(project) {
    console.log(`Loading slideshow for project: ${project.title}`);

    const heroSection = document.querySelector(".hero-section");

    // Clear existing content before inserting new slideshow
    clearSlideshow();

    // Create slideshow wrapper
    const slideshowWrapper = document.createElement("div");
    slideshowWrapper.id = "slideshow-wrapper";

    // Instructions
    const instructions = document.createElement("p");
    instructions.id = "instructions";
    instructions.textContent = "Use the Scroll Wheel, Nav Buttons or Arrow keys to View Panels. Or just click the image.";
    slideshowWrapper.appendChild(instructions);

    // Slideshow Container
    const slideshowContainer = document.createElement("div");
    slideshowContainer.id = "slideshow-container";

    const slideshowImage = document.createElement("img");
    slideshowImage.id = "slideshow-image";
    slideshowImage.src = ""; // Placeholder image (set later)
    slideshowImage.alt = "Slideshow Image";

    // Handle image loading errors
    slideshowImage.onerror = () => handleImageError();

    // Add event listener to fade in the image when it loads
    slideshowImage.onload = () => {
        slideshowImage.classList.add("loaded"); // Apply opacity transition
		// Clicking the image advances to the next frame
		slideshowImage.addEventListener("click", moveToNextImage);
    };

    slideshowContainer.appendChild(slideshowImage);
    slideshowWrapper.appendChild(slideshowContainer);
	
	// Create controls container
	const controls = document.createElement("div");
	controls.id = "controls";

	// Previous Button
	const prevBtn = document.createElement("button");
	prevBtn.id = "prev-btn";
	prevBtn.textContent = "← Prev";
	prevBtn.addEventListener("click", moveToPreviousImage);
	controls.appendChild(prevBtn);

	// Next Button
	const nextBtn = document.createElement("button");
	nextBtn.id = "next-btn";
	nextBtn.textContent = "Next →";
	nextBtn.addEventListener("click", moveToNextImage);
	controls.appendChild(nextBtn);

	// Restart Button
	const restartBtn = document.createElement("button");
	restartBtn.id = "restart-btn";
	restartBtn.textContent = "Restart";
	restartBtn.addEventListener("click", restartSlideshow);
	restartBtn.style.visibility = ""; // Initially hidden
	controls.appendChild(restartBtn);

	// Append the controls container to the slideshow
	slideshowWrapper.appendChild(controls);

    // Append the entire slideshow structure to the hero section
    heroSection.appendChild(slideshowWrapper);

    // Load image sequence from project
    imageSequence = project.imageSequence;
    currentImageIndex = 0; // Start at the first image
    preloadedImages = {}; // Reset the preloaded image buffer

    // Load the first image
    updateSlideshowImage();
	

	// Disable navigation if there is only one image
	if (imageSequence.length === 1) {
		document.removeEventListener("keydown", handleArrowNavigation);
		document.removeEventListener("wheel", handleScrollNavigation);
	} else {
		document.addEventListener("keydown", handleArrowNavigation);
		document.addEventListener("wheel", handleScrollNavigation, { passive: false });
	}


    // Enable keyboard and scroll navigation
    document.addEventListener("keydown", handleArrowNavigation);
    document.addEventListener("wheel", handleScrollNavigation, { passive: false });
}


// Function to restart the slideshow
function restartSlideshow() {
    currentImageIndex = 0;
    updateSlideshowImage();

    // ✅ Fix: Hide the Restart button after restarting
    document.getElementById("restart-btn").style.visibility = "hidden";
}

function updateSlideshowImage() {
    const slideshowImage = document.getElementById("slideshow-image");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-btn");

    if (!slideshowImage || imageSequence.length === 0) return;

    let imgSrc = imageSequence[currentImageIndex];

    if (!preloadedImages[imgSrc]) {
        slideshowImage.src = imgSrc; // Load first image immediately
    } else {
        slideshowImage.src = preloadedImages[imgSrc].src;
    }

    // Keep Prev and Next buttons in place but hide when needed
    prevBtn.classList.toggle("hidden", currentImageIndex === 0);
    nextBtn.classList.toggle("hidden", currentImageIndex === imageSequence.length - 1);

    // ✅ Fix: Show Restart button when user advances past the first image
    restartBtn.style.visibility = (currentImageIndex > 0) ? "visible" : "hidden";
}


// Function to handle image loading errors
function handleImageError() {
    console.warn(`Image failed to load: ${imageSequence[currentImageIndex]}`);
    
    // Try the next image
    if (currentImageIndex < imageSequence.length - 1) {
        console.log("Skipping to next available image...");
        currentImageIndex++;
        updateSlideshowImage();
    } else {
        console.log("No more valid images available. Stopping.");
    }
}

// Function to preload adjacent images
function preloadAdjacentImages() {
    const nextIndex = currentImageIndex + 1;
    const prevIndex = currentImageIndex - 1;

    // Preload next image
    if (nextIndex < imageSequence.length && !preloadedImages[imageSequence[nextIndex]]) {
        const nextImage = new Image();
        nextImage.src = imageSequence[nextIndex];
        preloadedImages[imageSequence[nextIndex]] = nextImage;
    }

    // Preload previous image
    if (prevIndex >= 0 && !preloadedImages[imageSequence[prevIndex]]) {
        const prevImage = new Image();
        prevImage.src = imageSequence[prevIndex];
        preloadedImages[imageSequence[prevIndex]] = prevImage;
    }
}

// Function to handle arrow key navigation
function handleArrowNavigation(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        moveToNextImage();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        moveToPreviousImage();
    }
}

// Function to handle scroll wheel navigation
function handleScrollNavigation(event) {
    event.preventDefault(); // Prevent the page from scrolling while using slideshow

    if (event.deltaY < 0) {
        moveToNextImage(); // Scroll up → next image
    } else if (event.deltaY > 0) {
        moveToPreviousImage(); // Scroll down → previous image
    }
}

// Function to move to the next image (if not at last)
function moveToNextImage() {
    if (currentImageIndex < imageSequence.length - 1) {
        currentImageIndex++;
        updateSlideshowImage();
    } else {
        console.log("End of slideshow reached.");
    }
}


// Function to move to the previous image (if not at first)
function moveToPreviousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateSlideshowImage();
    }
}

// Function to clear the slideshow if switching projects
function clearSlideshow() {
    const existingSlideshow = document.getElementById("slideshow-wrapper");
    if (existingSlideshow) {
        existingSlideshow.remove();
    }

    // Remove event listeners to prevent interference with new slideshows
    document.removeEventListener("keydown", handleArrowNavigation);
    document.removeEventListener("wheel", handleScrollNavigation);

    // Clear preloaded images
    preloadedImages = {};
}
