import { defineStore } from 'pinia';
import { type Pokemon } from '@/stores/pokemon';

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: loadFavorites()
  }),
  actions: {
    addFavorite(pokemon: Pokemon) {
      if (!this.favorites.find((p: Pokemon) => p.id === pokemon.id)) {
        this.favorites.push(pokemon);
        saveFavorites(this.favorites);
      }
    },
    removeFavorite(pokemonId: string) {
      const index = this.favorites.findIndex((f: Pokemon) => f.id === pokemonId);
      if (index > -1) {
        this.favorites.splice(index, 1);
        saveFavorites(this.favorites);
      }
    }
  }
});

function loadFavorites() {
  const stored = localStorage.getItem('favorites');
  return stored ? JSON.parse(stored) : [];
}

function saveFavorites(favorites: Pokemon[]) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}
