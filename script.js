
const apiBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
let firstPokemon = 1;
let cardCounter = 20;
let allPokemonList = [];
let pokemonCache = {};


async function init() {
    showLoader();
    await loadAllPokemonMetaList();
    await createAllCards();
    hideLoader();
}

async function loadAllPokemonMetaList() {
    let maxPokemon = 100;
    let response = await fetch(apiBaseUrl + `?limit=${maxPokemon}`);
    let data = await response.json();
    allPokemonList = data.results;
}

function showLoader() {
    document.getElementById('loaderOverlay').style.display = 'flex';
}

function hideLoader() {
    document.getElementById('loaderOverlay').style.display = 'none';
}

async function loadPokemon(id) {
    if (pokemonCache[id]) {
        return pokemonCache[id];
    }
    let response = await fetch(apiBaseUrl + id);
    let pokemon = await response.json();
    pokemonCache[id] = pokemon;
    return pokemon;
}

async function loadPokemonByUrl(pokemonUrl) {
    if (pokemonCache[pokemonUrl]) {
        return pokemonCache[pokemonUrl];
    }
    let response = await fetch(pokemonUrl);
    let pokemon = await response.json();
    pokemonCache[pokemonUrl] = pokemon;
    return pokemon;
}

function filterPokemonByName(searchValue) {
    let result = [];
    for (let index = 0; index < allPokemonList.length; index++) {
        if (allPokemonList[index].name.toLowerCase().includes(searchValue)) {
            result.push(allPokemonList[index]);
        }
    }
    return result;
}

function resetSearchUI() {
    document.getElementById("pokemonContainer").innerHTML = "";
    hideLoadMoreButton();
    let allBtn = document.getElementById("showAllBtn");
    if (allBtn) {
        allBtn.remove();
    }
}

async function loadAndShowResults(searchValue) {
    showSearchHint("");
    showLoader();
    let filteredPokemon = filterPokemonByName(searchValue);
    if (filteredPokemon.length === 0) {
        handleNoResults();
        return;
    }
    await renderSearchedPokemon(filteredPokemon);
    hideLoader();
}

async function showSearchedPokemon() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    resetSearchUI();
    if (!validateSearchInput(searchValue)) {
        return;
    }
    await loadAndShowResults(searchValue);
}

function validateSearchInput(searchValue) {
    if (searchValue.length < 3) {
        showSearchHint('Please enter at least <span>3 letters</span> to search.');
        return false;
    }
    return true;
}

function handleNoResults() {
    hideLoader();
    showSearchHint('No Pokémon found for your search.');
}

async function renderSearchedPokemon(pokemonList) {
    for (let index = 0; index < pokemonList.length && index < 20; index++) {
        let pokemon = await loadPokemonByUrl(pokemonList[index].url);
        createCard(pokemon);
    }
}

function hideLoadMoreButton() {
    let btn = document.getElementById("loadMoreBtn");
    if (btn) {
        btn.style.display = "none";
    }
}

function showSearchHint(message) {
    let container = document.getElementById("alert");
    if (!container) {
        return;
    }
    if (message) {
        container.innerHTML = `<div class="search-hint">${message}</div>`;
        container.style.display = "flex";
    } else {
        container.innerHTML = "";
        container.style.display = "none";
    }
}

function createCard(pokemon) {
    let container = document.getElementById("pokemonContainer");
    container.innerHTML += createCardTemplate(pokemon);
}

function formatId(id) {
    let idString = String(id);
    while (idString.length < 3) {
        idString = "0" + idString;
    }
    return idString;
}

function getPokemonImage(pokemon) {
    return pokemon.sprites.other["official-artwork"].front_default;
}

function getStatWidth(stat) {
    if (stat > 100) {
        return 100;
    }
    return stat;
}

function getSecondType(pokemon) {
    if (pokemon.types[1]) {
        return `<span class="type-badge type-${pokemon.types[1].type.name}">${pokemon.types[1].type.name}</span>`;
    }
    return "";
}

async function createAllCards() {
    showSearchHint("");
    let newCardsHtml = "";
    for (let index = firstPokemon; index <= cardCounter; index++) {
        let pokemon = await loadPokemon(index);
        newCardsHtml += createCardTemplate(pokemon);
    }
    document.getElementById("pokemonContainer").innerHTML += newCardsHtml;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') showSearchedPokemon();
    });
});

function updateCardCounter() {
    let container = document.getElementById("pokemonContainer");
    if (!container.innerHTML || container.querySelector('.search-hint')) {
        firstPokemon = 1;
        cardCounter = 20;
    } else {
        firstPokemon = cardCounter + 1;
        cardCounter = cardCounter + 20;
        if (cardCounter > allPokemonList.length) {
            cardCounter = allPokemonList.length;
        }
    }
}

async function loadMoreCards() {
    let btn = document.getElementById("loadMoreBtn");
    btn.disabled = true;
    showLoader();
    updateCardCounter();
    await createAllCards();
    if (cardCounter >= allPokemonList.length) {
        hideLoadMoreButton();
    } else {
        btn.disabled = false;
    }
    hideLoader();
}

function formatPokemonName(name) {
    let words = name.split('-');
    let result = '';
    for (let index = 0; index < words.length; index++) {
        if (index > 0) result += ' ';
        result += words[index].charAt(0).toUpperCase() + words[index].slice(1);
    }
    return result;
}

function getStatColor(value) {
    if (value >= 80) return '#4ade80';
    if (value >= 50) return '#facc15';
    return '#f87171';
}
