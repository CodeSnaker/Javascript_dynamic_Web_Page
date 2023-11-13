const API = "http://localhost:5678/api";
const OBJECT_ID = 1;
const APPARTEMENT_ID = 2;
const HOTELS_ID = 3;
const CATEGORIES_ID = [OBJECT_ID, APPARTEMENT_ID, HOTELS_ID];

const displayFilters = async () => {
/**
 * Displays filter buttons
 */
    const filters = document.getElementsByClassName("filters-container")[0];
    const response = await fetch(API+"/categories");
    const categories = await response.json();

    for (category of categories) {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.value = category.name;
        button.className = "filter";

        filters.appendChild(button);
    }
}

const removeFilters = async () => {
/**
 * removes filter buttons
 */
    const filters = document.querySelector(".filters-container");
    filters.innerHTML = "";
}

const determineWorkCategory = (work) => {
    switch (work.category.id) {
        case OBJECT_ID:
            return "objet";
        
        case APPARTEMENT_ID:
            return"appartement";
        
        case HOTELS_ID:
            return "hotel-resto";
        
        default:
            console.log("Invalid work category id");
            console.log(work);
            return "error";
    }
}

const displayWorks = async () => {
/**
 *  Displays all example work
 */
    const response = await fetch(API+"/works");
    const works = await response.json();
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    for (let work of works) {
        const category = determineWorkCategory(work);
        const figure = document.createElement("figure");
        figure.setAttribute("category", category);

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

const filterByCategory = async (category) => {
/**
 * 
 */
}


const init = () => {
    displayFilters();

    displayWorks();
}

init();
