<template>
  <v-container>
    <v-row>
      <template v-for="pokemon in pokemonList" :key="pokemon.id">
        <v-col cols="12" sm="6" md="4" lg="3" xl="2">
          <v-lazy :min-height="200" :options="{ threshold: 0.8 }" transition="fade-transition">
            <router-link :to="`/pokemon/${pokemon.id}`">
              <PokemonCard :pokemon="pokemon" :imageUrl="getPokemonImageURL(pokemon.id)" />
            </router-link>
          </v-lazy>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import PokemonCard from '@/components/PokemonCard.vue';

export default defineComponent({
  props: {
    pokemonList: {
      type: Array as PropType<{ id: string; name: string }[]>,
      required: true
    }
  },
  components: {
    PokemonCard
  },
  setup() {
    const getPokemonImageURL = (pokemonId: number) => {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    };
    return {
      getPokemonImageURL
    };
  }
});
</script>
