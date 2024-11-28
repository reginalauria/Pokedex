document.addEventListener('DOMContentLoaded', () => {
    const teamList = document.getElementById('teamList');
    const team = JSON.parse(localStorage.getItem('pokemonTeam')) || []; // Recuperar el equipo desde localStorage
    const backToListButton = document.getElementById('backToList'); // Botón para volver al listado
    const clearTeamButton = document.getElementById('clearTeam'); // Botón para borrar el equipo

// Función para renderizar el equipo
    const renderTeam = () => {
        teamList.innerHTML = ''; // Limpiar contenido existente

        if (team.length === 0) {
            // Mostrar mensaje si el equipo está vacío
            teamList.innerHTML = '<p class="text-center mt-4">No tienes Pokémon en tu equipo.</p>';
        } else {
            // Crear tarjetas para cada Pokémon en el equipo
            team.forEach(pokemon => {
                if (pokemon.id && pokemon.name) {
                    const pokemonItem = document.createElement('div');
                    pokemonItem.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");
                    pokemonItem.innerHTML = `
                        <div class="card">
                            <!-- Imagen del Pokémon -->
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" 
                                 class="card-img-top img-fluid mx-auto d-block" 
                                 alt="${pokemon.name}"
                                 style="max-width: 200px; height: auto;">
                            <div class="card-body">
                                <!-- Nombre del Pokémon -->
                                <h5 class="card-title text-center">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h5>
                            </div>
                        </div>
                    `;
                    teamList.appendChild(pokemonItem);
                }
            });
        }
    };

    // Evento para el botón "Volver al listado"
    backToListButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirige al listado principal
    });

    // Evento para el botón "Borrar equipo"
    clearTeamButton.addEventListener('click', () => {
        localStorage.removeItem('pokemonTeam'); // Eliminar el equipo del localStorage
        alert('Se ha borrado todo el equipo.');
        window.location.reload(); // Recargar la página para actualizar la vista
    });

    // Renderizar el equipo al cargar la página
    renderTeam();
});