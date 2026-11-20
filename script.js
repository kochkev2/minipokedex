/* initially used https://medium.com/@sergio13prez/fetching-them-all-poke-api-62ca580981a2 */
/* AI assisted in fixing fetch data and additional comments for clarity after all was written */


// Get the HTML elements
const pokemonForm = document.getElementById("pokemon-form");
const pokemonInput = document.getElementById("pokemon-input");
const pokemonResult = document.getElementById("pokemon-result");
const randomButton = document.getElementById("random-button");

// Fetch Pokémon data from PokéAPI.
async function fetchPokemon(pokemon) {
    pokemonResult.textContent = "Loading Pokémon...";

    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemon}`
        );

        if (!response.ok) {
            throw new Error("Pokémon not found!");
        }

        const data = await response.json();

        displayPokemon(data);

    } catch (error) {
        pokemonResult.textContent = error.message;
    }
}

// Display Pokémon information on the page.
function displayPokemon(data) {
    // Clear the previous search result.
    pokemonResult.innerHTML = "";

    // Pokémon name and Pokédex number.
    const name = document.createElement("h3");
    name.textContent =
        `${data.name.toUpperCase()} #${data.id}`;

    // Pokémon sprite.
    const sprite = document.createElement("img");
    sprite.src = data.sprites.front_default;
    sprite.alt = `Sprite of ${data.name}`;

    // Pokémon types.
    const types = document.createElement("p");
    types.textContent = "Type: " +
        data.types.map(type => type.type.name).join(", ");

    // Pokémon abilities.
    const abilities = document.createElement("p");
    abilities.textContent = "Abilities: " +
        data.abilities.map(ability => ability.ability.name).join(", ");

    // Pokémon base stats.
    const statsHeading = document.createElement("h4");
    statsHeading.textContent = "Base Stats";

    const statsList = document.createElement("ul");

    data.stats.forEach(stat => {
        const listItem = document.createElement("li");

        listItem.textContent =
            `${stat.stat.name}: ${stat.base_stat}`;

        statsList.appendChild(listItem);
    });

    // Add everything to the results section.
    pokemonResult.appendChild(name);
    pokemonResult.appendChild(sprite);
    pokemonResult.appendChild(types);
    pokemonResult.appendChild(abilities);
    pokemonResult.appendChild(statsHeading);
    pokemonResult.appendChild(statsList);
}

// Listen for the search form submission.

pokemonForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const pokemonName = pokemonInput.value.trim().toLowerCase();

    // Check for empty input.
    if (pokemonName === "") {
        pokemonResult.textContent =
            "Please enter a Pokémon name or number!";
        return;
    }

    // Only allow letters, numbers, and hyphens.
    if (!/^[a-z0-9-]+$/.test(pokemonName)) {
        pokemonResult.textContent =
            "Please use a valid Pokémon name or Pokédex number.";
        return;
    }

    // Pokédex numbers must be positive.
    if (/^\d+$/.test(pokemonName) && Number(pokemonName) < 1) {
        pokemonResult.textContent =
            "Pokédex numbers must be greater than zero.";
        return;
    }

    fetchPokemon(pokemonName);
});

/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor */
// Display a random Pokémon from the original 151.
randomButton.addEventListener("click", function() {
    const randomId = Math.floor(Math.random() * 151) + 1;

    fetchPokemon(randomId);
});


