const botonesHeader = document.querySelectorAll(".btn-header");
const listaPokemon = document.querySelector("#listaPokemon");
const searchInput = document.getElementById("searchInput");
const URL = "https://pokeapi.co/api/v2/pokemon";

let allPokemonData = []; // Variable para almacenar todos los datos de Pokémon

// Cargar todos los Pokémon al inicio
async function cargarTodosLosPokemon() {
    try {
        const response = await fetch(`${URL}?limit=1000`);
        const data = await response.json();
        const fetchPromises = data.results.map(pokemon =>
            fetch(pokemon.url).then(response => response.json())
        );
        allPokemonData = await Promise.all(fetchPromises);
        allPokemonData.forEach(poke => mostrarPokemon(poke));
    } catch (error) {
        console.error("Error al cargar Pokémon:", error);
    }
}

// Mostrar Pokémon en el DOM
function mostrarPokemon(poke) {
    let tipos = poke.types.map(type => `
        <p class="tipo badge ${type.type.name.toLowerCase()}">${type.type.name}</p>
    `).join('');

    const div = document.createElement("div");
    div.classList.add("pokemon", "col-12", "col-md-6", "col-lg-4", "mb-4");
    div.innerHTML = ` 
    <div class="pokemon card h-100 text-center shadow">
        <p class="pokemon-id-back text-muted mt-2">#${poke.id}</p>
        <img src="${poke.sprites.other['official-artwork'].front_default}"
             class="card-img-top mx-auto pokemon-imagen" alt="${poke.name}"
             style="width: 120px;">
        <div class="pokemon-info card-body">
            <p class="pokemon-id text-muted">#${poke.id}</p>
            <h2 class="pokemon-nombre fw-bold text-dark text-uppercase">${poke.name}</h2>
            <div class="pokemon-tipos mb-3">
                ${tipos}
            </div>
            <div class="pokemon-stats d-flex justify-content-center gap-3 fs-6">
                <p class="stat bg-light py-1 px-3 rounded-pill">${poke.height}M</p>
                <p class="stat bg-light py-1 px-3 rounded-pill">${poke.weight}KG</p>
            </div>
            <button class="btn btn-primary add-to-team mt-2" data-name="${poke.name}" data-id="${poke.id}">
                Agregar a mi equipo
            </button>
        </div>
    </div>`;
    listaPokemon.append(div);
}

// Cargar regiones en el Select
async function cargarRegiones() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokedex/`);
        const data = await response.json();
        const regionSelect = document.getElementById("regionSelect");
        regionSelect.innerHTML = '<option value="">Selecciona una región</option>';
        data.results.forEach((region, index) => {
            const option = document.createElement("option");
            option.value = index + 1;
            option.textContent = region.name.charAt(0).toUpperCase() + region.name.slice(1);
            regionSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar regiones:", error);
    }
}

// Cargar Pokémon de una región
async function cargarPokemonPorRegion(regionID) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokedex/${regionID}`);
        const data = await response.json();
        const regionPokemonNames = data.pokemon_entries.map(entry => entry.pokemon_species.name);
        const regionPokemon = allPokemonData.filter(poke =>
            regionPokemonNames.includes(poke.name)
        );
        listaPokemon.innerHTML = "";
        regionPokemon.forEach(poke => mostrarPokemon(poke));
    } catch (error) {
        console.error("Error al cargar Pokémon de la región:", error);
    }
}

// Escuchar cambios en el Select
document.getElementById("regionSelect").addEventListener("change", (e) => {
    const regionID = e.target.value;
    if (regionID) {
        cargarPokemonPorRegion(regionID);
    } else {
        listaPokemon.innerHTML = "";
        allPokemonData.forEach(poke => mostrarPokemon(poke));
    }
});

// Filtrar por tipos
botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    const filteredPokemon = botonId === "ver-todos"
        ? allPokemonData
        : allPokemonData.filter(poke => poke.types.some(type => type.type.name.includes(botonId)));
    listaPokemon.innerHTML = "";
    filteredPokemon.forEach(poke => mostrarPokemon(poke));
}));

// Buscar por nombre
searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPokemon = allPokemonData.filter(poke =>
        poke.name.toLowerCase().includes(searchTerm)
    );
    listaPokemon.innerHTML = "";
    filteredPokemon.forEach(poke => mostrarPokemon(poke));
});

// Inicializar la aplicación
cargarTodosLosPokemon();
cargarRegiones();

document.addEventListener("click", (e) => {
    // Verificar si el clic proviene de un botón "Agregar a mi equipo"
    if (e.target.classList.contains("add-to-team")) {
        const pokemonName = e.target.getAttribute("data-name"); // Obtener nombre del Pokémon
        const pokemonId = e.target.getAttribute("data-id"); // Obtener ID del Pokémon

        if (pokemonName && pokemonId) {
            let team = JSON.parse(localStorage.getItem("pokemonTeam")) || []; // Cargar equipo existente

            // Verificar si el Pokémon ya está en el equipo
            const exists = team.some((pokemon) => pokemon.id === pokemonId);
            if (!exists) {
                // Agregar el Pokémon al equipo
                team.push({ name: pokemonName, id: pokemonId });
                localStorage.setItem("pokemonTeam", JSON.stringify(team)); // Actualizar localStorage
                alert(`${pokemonName} ha sido añadido a tu equipo.`);
                window.location.href = "mi-equipo.html";
            } else {
                alert(`${pokemonName} ya está en tu equipo.`);
            }
        } 
    }
});
