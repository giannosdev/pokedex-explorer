import { defineStore } from 'pinia';
import gql from 'graphql-tag';
import client from '@/graphql/apolloClient';

export interface Pokemon {
  id: string
  name: string
  pokemon_v2_pokemon: {
    id: string;
    name: string;
    pokemon_v2_pokemontypes: {
      pokemon_v2_type: {
        name: string;
      }
    }[]
  }
}

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    allPokemon: [] as Pokemon[]
  }),

  actions: {
    async fetchPokemon() {
      if (this.allPokemon.length > 0) return;

      try {
        const { data } = await client.query({
          query: gql`
            query GetAllPokemon {
              pokemon_v2_pokemon {
                id
                name
                pokemon_v2_pokemontypes {
                  pokemon_v2_type {
                    name
                  }
                }
              }
            }
          `
        });

        this.allPokemon = data.pokemon_v2_pokemon;
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
    }
  }
});
