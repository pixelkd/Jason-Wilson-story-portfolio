document.addEventListener("DOMContentLoaded", function () {
    const sidebarTitle = document.getElementById("sidebarTitle");
    const sidebarContent = document.getElementById("sidebarContent");
    const heroSection = document.querySelector(".hero-section");
    const links = {
        linkA: "site_link_A",
        linkB: "link_B"
    };
    let currentProject = null; // Track currently displayed project

    // Load sidebar content dynamically
    function loadSidebarContent(sectionKey) {
        const section = projectData[sectionKey];

        if (!section) {
            console.error("Invalid section key:", sectionKey);
            return;
        }

        // Set sidebar title
        sidebarTitle.textContent = section.title;

        // Clear existing content in sidebar
        sidebarContent.innerHTML = "";

        // Check if the section has projects
        if (!section.projects || section.projects.length === 0) {
            console.warn(`No projects found in ${sectionKey}.`);
            clearHeroSection();
            return;
        }

        // Add project icons dynamically
        section.projects.forEach((project, index) => {
            const projectContainer = document.createElement("div");
            projectContainer.classList.add("project-item");

            // Project Icon (Thumbnail)
            const img = document.createElement("img");
            img.src = project.icon;
            img.alt = project.title;

            // Attach event listener to project icon
            projectContainer.addEventListener("click", () => {
                handleProjectClick(project);
            });

            // Append icon to the sidebar
            projectContainer.appendChild(img);
            sidebarContent.appendChild(projectContainer);
        });

        // Auto-load first project after sidebar is populated
        loadFirstProject(section.projects[0]);

        // Recalculate layout based on window size
        updateSidebarLayout();
    }

    // Function to load the first project in the section
    function loadFirstProject(project) {
        console.log(`Loading first project: ${project.title}`);

        // Force-clear the hero section before setting the new project
        clearHeroSection();

        // Load the project into the hero section
        loadProjectContent(project);
    }

    // Handle project click event
    function handleProjectClick(project) {
        if (currentProject && currentProject.title === project.title) {
            console.log(`Project ${project.title} is already active.`);
            return; // Prevent redundant reload
        }

        console.log(`Project clicked: ${project.title}`);

        // Clear hero section before loading new project
        clearHeroSection();

        // Load project content into the hero section
        loadProjectContent(project);
    }

    // Function to clear the hero section
    function clearHeroSection() {
        heroSection.innerHTML = ""; // Remove all content inside hero section
        currentProject = null; // Reset active project tracking
    }

    // Function to set project title in hero section
    function updateHeroTitle(title) {
        const titleElement = document.createElement("h2");
        titleElement.textContent = title;
        heroSection.appendChild(titleElement);
    }

    // Function to load project content dynamically
	function loadProjectContent(project) {
		console.log(`Loading project: ${project.title}`);

		// Set project as active
		currentProject = project;

		// Set title in hero section
		updateHeroTitle(project.title);

		// Load slideshow if applicable
		if (project.type === "slideshow") {
			loadSlideshow(project); // Calls function from slideshow.js
		} else {
			console.log("Other project type detected:", project.type);
		}
	}

    // Adjust sidebar layout dynamically
    function updateSidebarLayout() {
        if (window.matchMedia("(max-aspect-ratio: 1/1)").matches) {
            sidebarContent.style.display = "flex";
            sidebarContent.style.flexDirection = "row";
            sidebarContent.style.justifyContent = "center";
        } else {
            sidebarContent.style.display = "grid";
            sidebarContent.style.gridTemplateColumns = "1fr";
        }
    }

    // Load default content (Link A) and its first project on page load
    loadSidebarContent(links.linkA);

    // Optimized event listener for internal links
    document.querySelectorAll(".internal-links a").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const sectionKey = links[link.id];

            if (sectionKey) {
                loadSidebarContent(sectionKey); // Load sidebar and first project
            }
        });
    });

    // Adjust layout on window resize
    window.addEventListener("resize", updateSidebarLayout);
});
