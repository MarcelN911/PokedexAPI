
let lastFocusedElement = null;
let currentPokemonId = null;
let currentPokemon = null;


function prepareModalOverlay(id) {
    lastFocusedElement = document.activeElement;
    let modal = document.getElementById("modalOverlay");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    currentPokemonId = id;
}

function updateNavButtons() {
    let prevBtn = document.getElementById("modalPrev");
    let nextBtn = document.getElementById("modalNext");
    if (searchResultIds.length > 0) {
        let index = searchResultIds.indexOf(currentPokemonId);
        if (prevBtn) prevBtn.disabled = index <= 0;
        if (nextBtn) nextBtn.disabled = index >= searchResultIds.length - 1;
    } else {
        if (prevBtn) prevBtn.disabled = currentPokemonId <= 1;
        if (nextBtn) nextBtn.disabled = currentPokemonId >= cardCounter;
    }
}

function renderModalContent(modal, pokemon) {
    let mainType = pokemon.types[0].type.name;
    modal.className = "modal-overlay active type-" + mainType;
    modal.innerHTML = createCardModal(pokemon);
    document.getElementById("modalContent").innerHTML = modalContentAbout(pokemon);
    updateNavButtons();
    document.getElementById("modalClose").focus();
}

async function openModal(id) {
    prepareModalOverlay(id);
    let modal = document.getElementById("modalOverlay");
    let pokemon = await loadPokemon(id);
    currentPokemon = pokemon;
    renderModalContent(modal, pokemon);
}

function getNewPokemonId(direction) {
    if (searchResultIds.length > 0) {
        let currentIndex = searchResultIds.indexOf(currentPokemonId);
        let newIndex = currentIndex + direction;
        if (newIndex < 0 || newIndex >= searchResultIds.length) return null;
        return searchResultIds[newIndex];
    }
    let newId = currentPokemonId + direction;
    if (newId < 1 || newId > cardCounter) return null;
    return newId;
}

async function updateModal(direction) {
    let newId = getNewPokemonId(direction);
    if (newId === null) return;
    let pokemon = await loadPokemon(newId);
    currentPokemonId = newId;
    currentPokemon = pokemon;
    let modal = document.getElementById("modalOverlay");
    let mainType = pokemon.types[0].type.name;
    modal.className = "modal-overlay active type-" + mainType;
    document.getElementById("pokemonModal").outerHTML = createCardModal(pokemon);
    document.getElementById("modalContent").innerHTML = modalContentAbout(pokemon);
    updateNavButtons();
}

function closeModal() {
    let modal = document.getElementById("modalOverlay");
    modal.classList.remove("active");
    document.body.style.overflow = "";
    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                closeModal();
            }
        });
    }
});

function getFocusableElements() {
    let modal = document.getElementById('pokemonModal');
    return modal.querySelectorAll('button, [tabindex="0"]');
}

function getCurrentFocusIndex(focusable) {
    for (let index = 0; index < focusable.length; index++) {
        if (focusable[index] === document.activeElement) return index;
    }
    return -1;
}

function getNextFocusIndex(currentIndex, totalElements, goBackward) {
    if (goBackward) {
        if (currentIndex <= 0) return totalElements - 1;
        return currentIndex - 1;
    } else {
        if (currentIndex === totalElements - 1) return 0;
        return currentIndex + 1;
    }
}

function trapFocus(event) {
    let focusable = getFocusableElements();
    let currentIndex = getCurrentFocusIndex(focusable);
    event.preventDefault();
    let nextIndex = getNextFocusIndex(currentIndex, focusable.length, event.shiftKey);
    focusable[nextIndex].focus();
}

document.addEventListener('keydown', function(event) {
    let overlay = document.getElementById('modalOverlay');
    if (!overlay.classList.contains('active')) {
        return;
    }
    if (event.key === 'ArrowRight') updateModal(1);
    if (event.key === 'ArrowLeft') updateModal(-1);
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab') trapFocus(event);
});

function getPokemonBaseData(pokemon) {
    return {
        id: pokemon.id,
        name: pokemon.name,
        img: getPokemonImage(pokemon),
        height: (pokemon.height / 10).toFixed(1) + " m",
        weight: (pokemon.weight / 10).toFixed(1) + " kg",
        baseExp: pokemon.base_experience,
        mainType: pokemon.types[0].type.name
    };
}

function getModalData(pokemon) {
    let data = getPokemonBaseData(pokemon);
    data.abilities = getAbilitiesTemplate(pokemon);
    data.types = getTypesTemplate(pokemon);
    data.stats = getStatsTemplate(pokemon);
    data.moves = getMovesTemplate(pokemon);
    return data;
}

function getTypesTemplate(pokemon) {
    let typesHtml = "";
    for (let index = 0; index < pokemon.types.length; index++) {
        let typeName = pokemon.types[index].type.name;
        typesHtml += '<span class="type-badge type-' + typeName + '">' + typeName + '</span>';
    }
    return typesHtml;
}

function getMovesTemplate(pokemon) {
    let movesHtml = "";
    for (let index = 0; index < pokemon.moves.length; index++) {
        if (index >= 6) {
            break;
        }
        let moveName = pokemon.moves[index].move.name;
        movesHtml += '<span class="move-badge">' + moveName + '</span>';
    }
    return movesHtml;
}

function getAbilitiesTemplate(pokemon) {
    let abilities = "";
    for (let index = 0; index < pokemon.abilities.length; index++) {
        if (index > 0) abilities += ", ";
        abilities += pokemon.abilities[index].ability.name;
    }
    return abilities;
}

function switchTab(tab) {
    let content = document.getElementById("modalContent");
    let pokemon = currentPokemon;
    if (tab === "about") {
        content.innerHTML = modalContentAbout(pokemon);
        setActiveTab("about");
    } else if (tab === "stats") {
        content.innerHTML = modalContentStats(pokemon);
        setActiveTab("stats");
    } else if (tab === "moves") {
        content.innerHTML = modalContentMoves(pokemon);
        setActiveTab("moves");
    }
}

function setActiveTab(tab) {
    let allTabButtons = document.querySelectorAll('.tab-btn');
    for (let index = 0; index < allTabButtons.length; index++) {
        allTabButtons[index].classList.remove("active");
    }
    let activeButton = document.querySelector('.tab-btn[data-tab="' + tab + '"]');
    activeButton.classList.add("active");
}
