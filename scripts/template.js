
function createCardTemplate(pokemon) {
    return `<article class="pokemon-card bg-${pokemon.types[0].type.name}"
                onclick="openModal(${pokemon.id})"
                onkeydown="if(event.key==='Enter'||event.key===' ')openModal(${pokemon.id})"
                tabindex="0"
                role="button"
                aria-label="${formatPokemonName(pokemon.name)}, Pokémon #${formatId(pokemon.id)}">
                <div class="card-header">
                    <span class="pokemon-id">#${formatId(pokemon.id)}</span>
                    <span class="pokemon-name">${formatPokemonName(pokemon.name)}</span>
                </div>
                <div class="card-image">
                    <img src="${getPokemonImage(pokemon)}" alt="${formatPokemonName(pokemon.name)}" loading="lazy">
                </div>
                <div class="card-types">
                    <span class="type-badge type-${pokemon.types[0].type.name}">${pokemon.types[0].type.name}</span>
                    ${getSecondType(pokemon)}
                </div>
                <div class="card-stats">
                    <div class="stat">
                        <span class="stat-label">HP</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${getStatWidth(pokemon.stats[0].base_stat)}%; background: ${getStatColor(pokemon.stats[0].base_stat)};"></div>
                        </div>
                        <span class="stat-value">${pokemon.stats[0].base_stat}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">ATK</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${getStatWidth(pokemon.stats[1].base_stat)}%; background: ${getStatColor(pokemon.stats[1].base_stat)};"></div>
                        </div>
                        <span class="stat-value">${pokemon.stats[1].base_stat}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">DEF</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${getStatWidth(pokemon.stats[2].base_stat)}%; background: ${getStatColor(pokemon.stats[2].base_stat)};"></div>
                        </div>
                        <span class="stat-value">${pokemon.stats[2].base_stat}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">SPD</span>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${getStatWidth(pokemon.stats[5].base_stat)}%; background: ${getStatColor(pokemon.stats[5].base_stat)};"></div>
                        </div>
                        <span class="stat-value">${pokemon.stats[5].base_stat}</span>
                    </div>
                </div>
            </article>
        `;
}

function createCardModal(pokemon) {
    const data = getModalData(pokemon);
    const mainType = data.mainType;
    return `
        <div class="modal bg-${mainType}" id="pokemonModal" role="dialog" aria-modal="true" aria-labelledby="modal-pokemon-name">
            <button class="modal-close" id="modalClose" onclick="closeModal()" aria-label="Close modal">×</button>
            <button class="modal-nav modal-prev" id="modalPrev" onclick="updateModal(-1)" aria-label="Previous Pokémon">◀</button>
            <button class="modal-nav modal-next" id="modalNext" onclick="updateModal(1)" aria-label="Next Pokémon">▶</button>
            <div class="modal-header">
                <span class="modal-id">#${formatId(data.id)}</span>
                <h2 class="modal-name" id="modal-pokemon-name">${formatPokemonName(data.name)}</h2>
                <div class="modal-types">
                    ${data.types}
                </div>
            </div>
            <div class="modal-image">
                <img src="${data.img}" alt="${formatPokemonName(data.name)}" loading="lazy">
            </div>
            <div class="modal-tabs">
                    <button class="tab-btn active" data-tab="about" onclick="switchTab('about')">About</button>
                    <button class="tab-btn" data-tab="stats" onclick="switchTab('stats')">Stats</button>
                    <button class="tab-btn" data-tab="moves" onclick="switchTab('moves')">Moves</button>
            </div>
            <div class="modal-content" id="modalContent">

            </div>
        </div>
    `;
}

function modalContentAbout(pokemon) {
    const data = getModalData(pokemon);
    return `
        <div class="tab-content active" id="tab-about">
            <div class="info-row">
                <span class="info-label">Height</span>
                <span class="info-value">${data.height}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Weight</span>
                <span class="info-value">${data.weight}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Abilities</span>
                <span class="info-value">${data.abilities}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Base Exp</span>
                <span class="info-value">${data.baseExp}</span>
            </div>
            </div>
            <div class="tab-content" id="tab-stats">
                ${data.stats}
            </div>
            <div class="tab-content" id="tab-moves">
                <div class="moves-list">
                    ${data.moves}
                </div>
            </div>
    `;
}

function getStatsTemplate(pokemon) {
    let statsHtml = "";

    statsHtml += '<div class="stat-modal">';
    statsHtml += '<span class="stat-label">HP</span>';
    statsHtml += '<div class="stat-bar"><div class="stat-fill" style="width: ' + getStatWidth(pokemon.stats[0].base_stat) + '%; background: ' + getStatColor(pokemon.stats[0].base_stat) + ';"></div></div>';
    statsHtml += '<span class="stat-value">' + pokemon.stats[0].base_stat + '</span>';
    statsHtml += '</div>';

    statsHtml += '<div class="stat-modal">';
    statsHtml += '<span class="stat-label">ATK</span>';
    statsHtml += '<div class="stat-bar"><div class="stat-fill" style="width: ' + getStatWidth(pokemon.stats[1].base_stat) + '%; background: ' + getStatColor(pokemon.stats[1].base_stat) + ';"></div></div>';
    statsHtml += '<span class="stat-value">' + pokemon.stats[1].base_stat + '</span>';
    statsHtml += '</div>';

    statsHtml += '<div class="stat-modal">';
    statsHtml += '<span class="stat-label">DEF</span>';
    statsHtml += '<div class="stat-bar"><div class="stat-fill" style="width: ' + getStatWidth(pokemon.stats[2].base_stat) + '%; background: ' + getStatColor(pokemon.stats[2].base_stat) + ';"></div></div>';
    statsHtml += '<span class="stat-value">' + pokemon.stats[2].base_stat + '</span>';
    statsHtml += '</div>';

    statsHtml += '<div class="stat-modal">';
    statsHtml += '<span class="stat-label">SPD</span>';
    statsHtml += '<div class="stat-bar"><div class="stat-fill" style="width: ' + getStatWidth(pokemon.stats[5].base_stat) + '%; background: ' + getStatColor(pokemon.stats[5].base_stat) + ';"></div></div>';
    statsHtml += '<span class="stat-value">' + pokemon.stats[5].base_stat + '</span>';
    statsHtml += '</div>';
    return statsHtml;
}

function modalContentStats(pokemon) {
    const data = getModalData(pokemon);
    return `
        <div class="stats-list">
            ${data.stats}
        </div>
    `;
}

function modalContentMoves(pokemon) {
    return `
        <div class="moves-list">
            ${getMovesTemplate(pokemon)}
        </div>
    `;
}
