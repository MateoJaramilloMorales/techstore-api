export const getPokemonData = async (name: string) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) throw new Error("Pokemon no encontrado");
    const data = await response.json();
    return {
        name: data.name,
        image: data.sprites.front_default,
        types: data.types.map((t: any) => t.type.name)
    };
};