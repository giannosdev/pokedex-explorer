<template>
  <v-autocomplete
    class="ma-auto mb-0 mt-1 searchbox"
    v-model:search-input="searchInput"
    @update:search="onInput"
    :items="filteredPokemon"
    label="Search Pokemon"
    outlined
    clearable
    :menu-props="{ closeOnContentClick: true }"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-title>Type a pokemon name to search</v-list-item-title>
      </v-list-item>
    </template>

    <template #item="{ item }">
      <router-link :to="`/pokemon/${item.value}`">
        <v-list-item>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </router-link>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { usePokemonStore } from '@/stores/pokemon.js';

export default defineComponent({
  setup() {
    const searchInput = ref('');
    const pokemonStore = usePokemonStore();
    const filteredPokemon = ref([]);

    const transformPokemon = (pokemon) =>
      computed(() => {
        return pokemon.map((pokemon) => ({
          title: pokemon.name,
          value: pokemon.id
        }));
      });

    const filterPokemon = (searchText: string) => {
      if (searchText.length <= 1) {
        return [];
      }

      return transformPokemon(
        pokemonStore.allPokemon.filter((pokemon) =>
          pokemon.name.toLowerCase().startsWith(searchText.toLowerCase().trim())
        )
      );
    };

    const onInput = (s) => {
      searchInput.value = s;
      filteredPokemon.value = filterPokemon(s).value;
    };

    return { searchInput, filteredPokemon, onInput };
  }
});
</script>

<style>
.searchbox {
  max-width: 60%;
}
</style>
