<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-chip-group active-class="primary--text">
          <v-chip
            v-for="(type, index) in pokemonTypes"
            :key="index"
            @click="selectType(type)"
            filter
            outlined
            >{{ type }}</v-chip
          >
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
  <PokemonList :pokemonList="displayedPokemon"></PokemonList>
  <v-layout>
    <v-bottom-navigation>
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="totalVisible"
        @input="updatePage"
        @prev="updatePage('prev')"
        @next="updatePage('next')"
      ></v-pagination>
    </v-bottom-navigation>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, Ref } from 'vue';
import PokemonList from '@/components/PokemonList.vue';
import { usePokemonStore } from '@/stores/pokemon.js';

export default defineComponent({
  components: {
    PokemonList
  },
  setup() {
    const pokemonStore = usePokemonStore();
    const currentPage: Ref<number> = ref(1);
    const pageSize: number = 200;
    const totalVisible: number = 5;
    const selectedType = ref(null);

    const displayedPokemon = computed(() => {
      let filteredPokemon = pokemonStore.allPokemon;

      if (selectedType.value) {
        filteredPokemon = pokemonStore.allPokemon.filter((pokemon) =>
          pokemon.pokemon_v2_pokemontypes
            .map((type) => type.pokemon_v2_type.name)
            .includes(selectedType.value)
        );
      }

      const startIndex = (currentPage.value - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      return filteredPokemon.slice(startIndex, endIndex);
    });

    let totalPages = ref(0);

    watch(
      [() => selectedType.value, () => pokemonStore.allPokemon],
      () => {
        let filteredPokemon = pokemonStore.allPokemon;

        if (selectedType.value) {
          filteredPokemon = filteredPokemon.filter((pokemon) =>
            pokemon.pokemon_v2_pokemontypes
              .map((type) => type.pokemon_v2_type.name)
              .includes(selectedType.value)
          );
        }

        totalPages.value = Math.ceil(filteredPokemon.length / pageSize);
      },
      { immediate: true }
    );

    const nextPage = () => {
      if (currentPage.value * pageSize < pokemonStore.allPokemon.length) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const updatePage = (direction: 'prev' | 'next') => {
      if (direction === 'prev' && currentPage.value > 1) {
        currentPage.value--;
      } else if (direction === 'next' && currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const pokemonTypes = computed(() => {
      const types = new Set();
      pokemonStore.allPokemon.forEach((pokemon) => {
        pokemon.pokemon_v2_pokemontypes.forEach((type) => types.add(type.pokemon_v2_type.name));
      });
      return Array.from(types);
    });

    const selectType = (type) => {
      if (selectedType.value === type) {
        selectedType.value = null;
      } else {
        selectedType.value = type;
      }
      currentPage.value = 1;
    };

    return {
      allPokemon: pokemonStore.allPokemon,
      currentPage,
      pageSize,
      displayedPokemon,
      nextPage,
      prevPage,
      totalPages,
      totalVisible,
      updatePage,
      pokemonTypes,
      selectType,
      selectedType
    };
  }
});
</script>
