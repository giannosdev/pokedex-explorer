<template>
  <div id="app">
    <v-layout>
      <v-app-bar :elevation="2">
        <v-container>
          <v-row align="center">
            <v-col class="pa-0" cols="auto">
              <v-app-bar-title
                ><router-link to="/" style="text-decoration: none; color: initial"
                  >Pokedex Explorer</router-link
                ></v-app-bar-title
              >
            </v-col>
            <v-col class="d-flex align-center justify-center"
              ><PokemonSearchBox :allPokemon="pokemonsFromStore" />
            </v-col>
            <v-col cols="auto" class="text-right">
              <v-btn icon @click="drawer = true">
                <v-icon v-if="favoriteCount">mdi-heart</v-icon>
                <v-icon v-else>mdi-heart-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" temporary clipped location="right">
        <FavoritePokemonList />
      </v-navigation-drawer>
    </v-layout>

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import PokemonSearchBox from '@/components/PokemonSearchBox.vue';
import { useFavoritesStore } from '@/stores/favorites.js';
import FavoritePokemonList from '@/components/FavoritePokemonList.vue';
import { usePokemonStore } from '@/stores/pokemon.js';

export default defineComponent({
  name: 'App',
  components: { PokemonSearchBox, FavoritePokemonList },
  setup() {
    const drawer = ref(false);
    const favoriteStore = useFavoritesStore();
    const pokemonStore = usePokemonStore();

    onMounted(async () => {
      await pokemonStore.fetchPokemon();
    });

    const favoriteCount = computed(() => favoriteStore.favorites.length);
    const pokemonsFromStore = computed(() => pokemonStore.allPokemon);

    return { drawer, favoriteCount, pokemonsFromStore };
  }
});
</script>
