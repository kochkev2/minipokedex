/* initially used https://medium.com/@sergio13prez/fetching-them-all-poke-api-62ca580981a2 */
/* AI assisted in fixing fetch data and additional comments for clarity after all was written */


// Get the HTML elements
const pokemonForm = document.getElementById("pokemon-form");
const pokemonInput = document.getElementById("pokemon-input");
const pokemonResult = document.getElementById("pokemon-result");
const randomButton = document.getElementById("random-button");
const pokemonCard = document.getElementById("pokemon-card");

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
        fetchPokemonCard(data.name);

    } catch (error) {
        pokemonResult.textContent = error.message;
        pokemonCard.textContent = "Search for a valid Pokémon to see a card.";
    }
}

// Display Pokémon information on the page.

function displayPokemon(data) {
    // Clear the previous result.
    pokemonResult.innerHTML = "";

    // Name and Pokédex number.
    const name = document.createElement("h3");
    name.className = "pokemon-name";
    name.textContent =
        `${data.name.toUpperCase()} #${String(data.id).padStart(3, "0")}`;

    // Pokémon sprite.
    const sprite = document.createElement("img");
    sprite.className = "pokemon-sprite";
    sprite.src = data.sprites.front_default;
    sprite.alt = `Sprite of ${data.name}`;

    // Pokémon types.
    const types = document.createElement("div");
    types.className = "pokemon-types";

    data.types.forEach(type => {
        const typeBadge = document.createElement("span");
        typeBadge.className = "type-badge";
        typeBadge.textContent = type.type.name;
        types.appendChild(typeBadge);
    });

    // Pokémon abilities.
    const abilities = document.createElement("p");
    abilities.className = "pokemon-abilities";
    abilities.textContent = "Abilities: " +
        data.abilities.map(ability => ability.ability.name).join(", ");

    // Pokémon base stats.
    const statsHeading = document.createElement("h4");
    statsHeading.textContent = "Base Stats";

    const statsList = document.createElement("ul");
    statsList.className = "pokemon-stats";

    data.stats.forEach(stat => {
        const listItem = document.createElement("li");
        listItem.textContent =
            `${stat.stat.name}: ${stat.base_stat}`;
        statsList.appendChild(listItem);
    });

    // Display the results.
    pokemonResult.appendChild(name);
    pokemonResult.appendChild(sprite);
    pokemonResult.appendChild(types);
    pokemonResult.appendChild(abilities);
    pokemonResult.appendChild(statsHeading);
    pokemonResult.appendChild(statsList);
}


// Fetch a matching Pokémon trading card from TCGdex.
async function fetchPokemonCard(pokemonName) {
    pokemonCard.textContent = "Loading trading card...";

    try {
        const response = await fetch(
            `https://api.tcgdex.net/v2/en/cards?name=${encodeURIComponent(pokemonName)}`
        );

        if (!response.ok) {
            throw new Error("Unable to load trading cards.");
        }

        const cards = await response.json();

        // Find an exact Pokémon name match with an image.
        const matchingCard = cards.find(card =>
            card.name.toLowerCase() === pokemonName.toLowerCase()
            && card.image
        );

        pokemonCard.innerHTML = "";

        if (!matchingCard) {
            pokemonCard.textContent =
                "No matching trading card was found.";
            return;
        }

        // Display the trading card image.
        const cardImage = document.createElement("img");
        cardImage.src = `${matchingCard.image}/high.webp`;
        cardImage.alt = `${matchingCard.name} Pokémon trading card`;
        cardImage.className = "trading-card-image";

        const cardName = document.createElement("p");
        cardName.textContent = matchingCard.name;

        pokemonCard.appendChild(cardImage);
        pokemonCard.appendChild(cardName);

    } catch (error) {
        pokemonCard.textContent =
            "Trading card information is currently unavailable.";
        console.error(error);
    }
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


