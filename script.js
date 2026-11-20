/* initially used https://medium.com/@sergio13prez/fetching-them-all-poke-api-62ca580981a2 */
/* AI assisted in fixing fetch data after all was written */

const pokemonForm = document.getElementById("pokemon-form");
const pokemonInput = document.getElementById("pokemon-input");


async function fetchPokemon(pokemon) {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemon}`
        );

        if (!response.ok) {
            throw new Error("Pokémon not found!");
        }

        const data = await response.json();

        console.log(data);

    } catch (error) {
        console.error("Error fetching Pokémon:", error);
    }
}

pokemonForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const pokemonName = pokemonInput.value.trim().toLowerCase();

    if (pokemonName === "") {
        alert("Please enter a Pokémon name or number!");
        return;
    }

    fetchPokemon(pokemonName);
});
