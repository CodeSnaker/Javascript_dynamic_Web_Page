const API = "http://localhost:5678/api";
const OBJECT_ID = 1;
const APPARTEMENT_ID = 2;
const HOTELS_ID = 3;
const OBJECT_CAT = "objets";
const APPARTEMENT_CAT = "appartements";
const HOTELS_CAT = "hotel-resto";
const TOUS_CAT = "tous";


/**
 * @brief Displays filter buttons
 */
const displayFilters = async () => {

    const filters = document.querySelector(".filters-container");
    const response = await fetch(API+"/categories");
    // "Tous" isn't a category in the API so we add that to make the button
    const tousCat = {
        "id": 0,
        "name": "Tous"
    }
    let categories = await response.json();
    categories.unshift(tousCat);

    for (category of categories) {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.value = nameToCategory(category.name);
        button.className = "filter";
        if (button.value === "tous") {
            button.classList.add("filter-active");
        }
        filters.appendChild(button);
        setFilterListener(button);
    }
}

/**
 * 
 * @param {string} name: the name of categories
 * @returns Standardized string of category name
 */
const nameToCategory = (name) => {
    switch (name) {

        case "Objets":
            return "objets";
        
        case "Appartements":
            return APPARTEMENT_CAT;
        
        case "Hotels & restaurants":
            return HOTELS_CAT;
        
        case "Tous":
            return TOUS_CAT;
        
        default:
            return "Error";
    }
}

/**
 * @brief sets a listener for "click" event for the specified filter
 * 
 * @param {object} filter 
 */
const setFilterListener = async (targetFilter) => {
    targetFilter.addEventListener("click", () => {
        const filters = document.getElementsByClassName("filter");
        for (let filter of filters) {
            if (filter.className.includes("filter-active")) {
                filter.classList.remove("filter-active");
            }
        }
        targetFilter.classList.add("filter-active");
        console.log("listener activated for " + targetFilter.value);
        filterByCategory(targetFilter.value);
    })
}

/**
 * Determine a corresponding category name from category id
 * 
 * @param {object} work from API
 * @returns Standardized category name
 */
const idToCategory = (work) => {

    switch (work.category.id) {
        case OBJECT_ID:
            return OBJECT_CAT;
        
        case APPARTEMENT_ID:
            return APPARTEMENT_CAT;
        
        case HOTELS_ID:
            return HOTELS_CAT;
        
        default:
            console.log("Invalid work category id");
            console.log(work);
            return "error";
    }
}


/**
 * @brief display project examples saved in back-end in 'mes projets' section
 * and adds a category to each
 */
const displayWorks = async () => {
    const response = await fetch(API+"/works");
    const works = await response.json();
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""; //Reset gallery

    for (let work of works) {
        // const category = idToCategory(work);
        const figure = document.createElement("figure");
        figure.setAttribute("category", idToCategory(work));
        figure.classList.add("work");

        const img = document.createElement("img");
        img.alt = work.title;
        img.src = work.imageUrl;

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

/**
 * @brief displays project examples saved in back-end in modal window
 * and adds a category to each
 * 
 */
const displayModalWorks = async () => {
    const response = await fetch(API+"/works");
    const works = await response.json();
    const gallery = document.querySelector(".modal-works");

    for (let work of works) {
        const figure = document.createElement("figure");
        figure.setAttribute("category", idToCategory(work));
        figure.classList.add("work");

        const img = document.createElement("img");
        img.alt = work.title;
        img.src = work.imageUrl;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        // setDeleteWorkListener(deleteButton);
        
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fa-solid fa-trash-can";
        deleteButton.appendChild(deleteIcon)

        figure.appendChild(img);
        figure.appendChild(deleteButton);
        gallery.appendChild(figure);
    }
}

/**
 * @brief Set event listener for a delete button in modal window
 * 
 * @param {Node} button
 */
const setDeleteWorkListener = (button) => {
    button.addEventListener("click", () => {
        //TODO
    });
}


/**
 * @brief Adds "work-inactive" class to work examples 
 * that do not have the specified category property and removes it from the specified category
 * 
 * @param {string} category 
 */
const filterByCategory = (category) => {

    const gallery = document.querySelector(".gallery");
    console.log(category);
    if (category === TOUS_CAT){
        // Display all work example when "all" filter is on
        const inactiveWorks = document.querySelectorAll(".work-inactive");
        for (let i=0; i < inactiveWorks.length; i++) {
            const work = inactiveWorks[i];
            work.classList.remove("work-inactive");
        }
    } else {
        for (let i=0; i < gallery.children.length; i++) {
            const work = gallery.children[i];
            if (work.getAttribute("category") === category) {
                work.classList.remove("work-inactive");
            } else {
                work.classList.add("work-inactive");
            }
        }
    }
}

/**
 * @brief when initiating the page, checks if logged in or not,
 * then switch to setting mode if logged in
 * 
 */
const checkIfLogged = () => {
    const siteUser = window.localStorage.getItem("token");

    if (siteUser === null) {
        return;
    }

    displaySettingMode();
}


/**
 * @brief Makes changes for Setting Mode
 * 
 */
const displaySettingMode = () => {
    const loginNav = document.querySelector('.nav-link[href="login.html"]')
    loginNav.innerHTML = "logout";
    loginNav.addEventListener("click", () => {
        localStorage.removeItem("token");
    });

    document.querySelector(".header").style.marginTop = "88px";
    document.querySelector(".setting-header").style.display = "flex";
    document.querySelector(".projects-title").style.marginBottom = "92px";
    document.querySelector(".filters-container").style.display = "none";
    document.querySelector(".modifier-projects").style.display = "flex";
}

/**
 * @brief Set event listeners for 'modifier' button in 'mes projets' section
 * 
 */
const setModifierListener = () => {
    const modifierDiv = document.querySelector(".modifier-projects");

    modifierDiv.addEventListener("click", () => {
        document.querySelector(".modal-background").style.display = "block";
        document.querySelector(".modal-gallery").style.display = "flex";
    })
}

/**
 * @brief Set event listeners for close 'X' buttons in modal windows
 * 
 */
const setCloseListeners = () => {
    const closeButtons = document.querySelectorAll(".close-button");
    for (let i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener("click", () => {
            document.querySelector(".modal-background").style.display = "none";
            document.querySelector(".modal-gallery").style.display = "none";
        })
    }
}

/**
 * @brief configure Modal windows
 * 
 */
const configureModals = async () => {
    setModifierListener();
    await displayModalWorks();
    setCloseListeners();
}



/**
 * @brief Initializes the index page
 */
const init = () => {
    displayFilters();
    displayWorks();
    setModals();

    const gallery = document.querySelector(".gallery");
    console.log(gallery.children);
    for (let work of gallery.children) {
        console.log(work);
    }

    checkIfLogged();

}

init();
