<template>
  <v-card class="pokemon-card" :data-favorited="isFavorite.toString()">
    <v-img :src="imageUrl" aspect-ratio="16/9">
      <v-btn class="favorite-btn" icon @click="toggleFavorite" @mouseover.stop="">
        <v-icon v-if="isFavorite">mdi-heart</v-icon>
        <v-icon v-else>mdi-heart-outline</v-icon>
      </v-btn>
    </v-img>
    <v-card-title class="pokemon-name">{{ pokemon.name }}</v-card-title>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, type PropType, computed } from 'vue';
import { useFavoritesStore } from '@/stores/favorites';

export default defineComponent({
  props: {
    pokemon: {
      type: Object as PropType<{ id: string; name: string }>,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const favoriteStore = useFavoritesStore();

    const isFavorite = computed(() =>
      favoriteStore.favorites.some((f) => f.id === props.pokemon.id)
    );

    const toggleFavorite = (e: Event) => {
      e.preventDefault();
      if (isFavorite.value) {
        favoriteStore.removeFavorite(props.pokemon);
      } else {
        favoriteStore.addFavorite({ ...props.pokemon, imageUrl: props.imageUrl });
      }
    };

    return { isFavorite, toggleFavorite };
  }
});
</script>

<style lang="scss" scoped>
.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.pokemon-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  .pokemon-name {
    text-transform: capitalize;
    text-align: center;
  }
  &:hover {
    box-shadow:
      0 14px 28px rgba(255, 255, 255, 0.25),
      0 10px 10px rgba(255, 255, 255, 0.22);

    .favorite-btn {
      opacity: 1;
    }
  }

  &[data-favorited='true'] {
    .favorite-btn {
      opacity: 1;
    }
  }
}
</style>
