<template>
  <v-card>
    <v-card-title>Favorites</v-card-title>
    <v-card-subtitle>
      <v-text-field v-model="search" label="Search" clearable></v-text-field>
    </v-card-subtitle>
    <v-list lines="two">
      <v-list-item
        v-for="pokemon in filteredFavorites"
        :key="pokemon.id"
        :title="pokemon.name"
        :prepend-avatar="pokemon.imageUrl"
      >
        <template v-slot:append>
          <v-btn icon @click="removeFavorite(pokemon.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useFavoritesStore } from '@/stores/favorites.js';
import { type Pokemon } from '@/stores/pokemon';

export default defineComponent({
  setup() {
    const search = ref('');
    const favoriteStore = useFavoritesStore();

    const removeFavorite = (pokemonId: string) => {
      favoriteStore.removeFavorite(pokemonId);
    };

    const filteredFavorites = computed(() => {
      if (!search.value) return favoriteStore.favorites;

      return favoriteStore.favorites.filter((pokemon: Pokemon) =>
        pokemon.name.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    return { search, filteredFavorites, removeFavorite };
  }
});
</script>
