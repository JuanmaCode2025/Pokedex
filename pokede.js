// Configuración inicial de los botones
document.getElementById("search-btn").addEventListener("click", async () => {
    const input = document.getElementById("pokemon-search");
    const pokemonNombre = input.value.trim();
   if (pokemonNombre) {
    await cargarPokemon(pokemonNombre);
    input.value = ""; // Limpiar el campo después de buscar
} else {
    Swal.fire({
        title: 'Alerta Entrenador',
        html: `
            <div style="text-align: center;">
                <img src="https://pm1.aminoapps.com/6344/cfb82b1523a611ab3acbdaf9f0c6b74e3492435e_hq.jpg" 
                     width="80" 
                     style="margin-bottom: 1rem;">
                <p style="font-size: 1.1rem; color: #333;">Debes ingresar un nombre de Pokémon</p>
            </div>
        `,
        background: '#fff',
        confirmButtonColor: '#e53935',
        confirmButtonText: 'Entendido',
        width: '400px',
        customClass: {
            popup: 'pokemon-alert'
        }
    });
}
})

document.getElementById("random-btn").addEventListener("click", async () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    await cargarPokemon(randomId);
});

// Cargar un Pokémon aleatorio al inicio
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("random-btn").click();
});

// Tipos de Pokémon y sus colores
const Types_Color = {
    normal: "gray",
    fire: "red",
    water: "blue",
    grass: "green",
    electric: "yellow",
    ice: "cyan",
    fighting: "brown",
    poison: "purple",
    ground: "sienna",
    flying: "skyblue",
    psychic: "#fe019a",
    bug: "olive",
    rock: "brown",
    ghost: "indigo",
    dragon: "darkblue",
    dark: "black",
    steel: "silver",
    fairy: "lightpink"
};

function obtenerColor(tipo) {
    return Types_Color[tipo.toLowerCase()] || "white";
}

function translateStat(statName) {
    const stats = {
        "hp": "HP",
        "attack": "Ataque",
        "defense": "Defensa",
        "special-attack": "At. Especial",
        "special-defense": "Def. Especial",
        "speed": "Velocidad"
    };
    return stats[statName] || statName;
}

// Función principal para cargar Pokémon
async function cargarPokemon(idONombre) {
    try {
        // Limpiar contenedores que se actualizan
        document.getElementById("tipos").innerHTML = "";
        document.getElementById("weaknesses-list").innerHTML = "";
        document.getElementById("moves-list").innerHTML = "";
        document.getElementById("pokemon-stats").innerHTML = "";

        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idONombre}`);
        console.log(res);

        // Información básica
        document.getElementById("Nombre_pokemon").textContent = res.data.name;
        document.getElementById("ID").textContent = `#${res.data.id}`;
        document.getElementById("img_pokemon").src = res.data.sprites.other.home.front_default || res.data.sprites.other['official-artwork'].front_default;

        // Altura y peso
        document.getElementById("altura").textContent = `${(res.data.height / 10).toFixed(1)} m`;
        document.getElementById("peso").textContent = `${(res.data.weight / 10).toFixed(1)} kg`;

        // Tipos
        const tipos = res.data.types.map(item => item.type.name);
        const contenedorBotones = document.getElementById("tipos");
        tipos.forEach(tipo => {
            const color = obtenerColor(tipo);
            contenedorBotones.innerHTML += `<button class="type-badge" style="background-color: ${color};">${tipo}</button>`;
        });

        // Debilidades
        const debilidades = await axios.get(res.data.types[0].type.url);
        debilidades.data.damage_relations.double_damage_from.forEach((tipo) => {
            const color = obtenerColor(tipo.name);
            document.getElementById("weaknesses-list").innerHTML += `
                <button class="type-badge" style="background-color: ${color};">${tipo.name}</button>`;
        });

        // Movimientos (mostrar primeros 5)
        const movimientos = res.data.moves.map(item => item.move.name);
        const lista = document.getElementById("moves-list");
        for (let i = 0; i < 5 && i < movimientos.length; i++) {
            lista.innerHTML += `<li>${movimientos[i]}</li>`;
        }

        // Color de la tarjeta según tipo
        const card = document.querySelector(".card");
        if (tipos.length === 1) {
            card.style.background = obtenerColor(tipos[0]);
        } else if (tipos.length === 2) {
            const color1 = obtenerColor(tipos[0]);
            const color2 = obtenerColor(tipos[1]);
            card.style.background = `linear-gradient(80deg, ${color1} 40%, ${color2} 49%)`;
        }

        // Estadísticas
        const stats = res.data.stats;
        const container = document.getElementById("pokemon-stats");
        stats.forEach(stat => {
            const statName = stat.stat.name;
            const baseStat = stat.base_stat;
            const statClass = `stat-${statName.replace("special-", "")}`;
            const progressPercent = (baseStat / 255) * 100;

            const statItem = document.createElement("div");
            statItem.className = "stat-item";
            statItem.innerHTML = `
                <div class="stat-info">
                    <span class="stat-name">${translateStat(statName)}</span>
                    <span class="stat-value">${baseStat} / 255</span>
                </div>
                <div class="stat-bar"></div>
            `;

            const statProgress = document.createElement("div");
            statProgress.className = `stat-progress ${statClass}`;
            statProgress.style.width = "0";
            statItem.querySelector(".stat-bar").appendChild(statProgress);
            container.appendChild(statItem);

            setTimeout(() => {
                statProgress.style.width = `${progressPercent}%`;
            }, 100);
        });

    } catch (error) {
        // Usar window.Swal para asegurar que encuentra la librería
        await window.Swal.fire({
            title: '¡Pokémon no encontrado!',
            text: `No se encontró "${idONombre}". Intenta con otro nombre o ID.`,
            icon: 'error',
            confirmButtonText: 'Entendido',
            showCancelButton: true,
            cancelButtonText: 'Pokémon aleatorio',
            background: '#ffebee',
            confirmButtonColor: '#f44336'
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
                const randomId = Math.floor(Math.random() * 1025) + 1;
                cargarPokemon(randomId);
            }
        });
    }
}






function Desplegar() {
    const details = document.getElementById('additionalDetails');
    const button = document.querySelector('.details-toggle');

    details.classList.toggle('active');

    if (details.classList.contains('active')) {
        button.textContent = '▲ Menos información';
    } else {
        button.textContent = '▼ Más información';
    }
}


