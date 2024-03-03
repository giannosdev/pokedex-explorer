<script lang="ts">
import {defineComponent, onMounted, type Ref, ref, watchEffect} from 'vue';
import gql from 'graphql-tag';
import client from '@/graphql/apolloClient';
import { useRoute } from 'vue-router';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import PokeballLoader from '@/components/PokeballLoader.vue';

interface PokemonDetails {
  name: string
  pokemon_v2_pokemonstats: {
    base_stat: number
    pokemon_v2_stat: {
      name: string
    }
  }[]
  pokemon_v2_pokemontypes: {
    pokemon_v2_type: {
      name: string
    }
  }[]
  pokemon_v2_pokemonabilities: {
    pokemon_v2_ability: {
      name: string
    }
  }[]
}

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  components: {
    PokeballLoader,
    Bar
  },
  setup() {
    const route = useRoute();
    const pokemonId = route.params.id;

    const pokemonDetails: Ref<PokemonDetails | null> = ref(null);

    const getPokemonImageURL = (pokemonId: string) => {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    };

    const fetchPokemonDetails = async (_pokemonId?: string) => {
      const pId = _pokemonId ?? pokemonId.toString();

      const { data, loading, error } = await client.query({
        query: gql`
          query PokemonDetails($id: Int!) {
            pokemon_v2_pokemon(where: { id: { _eq: $id } }) {
              name
              height
              weight
              pokemon_v2_pokemonstats {
                base_stat

                pokemon_v2_stat {
                  name
                  pokemon_v2_natures {
                    name
                  }
                }
              }
              pokemon_v2_pokemontypes {
                pokemon_v2_type {
                  name
                }
              }
              pokemon_v2_pokemonabilities {
                pokemon_v2_ability {
                  name
                }
              }
            }
          }
        `,
        variables: { id: pId }
      });

      if (!loading && !error) {
        pokemonDetails.value = {
          ...data.pokemon_v2_pokemon[0],
          imageUrl: getPokemonImageURL(pId)
        };
      }
    };

    onMounted(fetchPokemonDetails);

    const getChartData = () => {
      if (!pokemonDetails.value) return {};

      try {
        return {
          labels: pokemonDetails.value?.pokemon_v2_pokemonstats.map(
            (stat) => stat.pokemon_v2_stat.name
          ),
          datasets: [
            {
              label: 'Stat points',
              data: pokemonDetails.value?.pokemon_v2_pokemonstats.map((stat) => stat.base_stat),
              backgroundColor: 'rgba(54, 162, 235, 0.2)'
            }
          ]
        };
      } catch (error) {
        console.error('Error generating chart data:', error);
        return {};
      }
    };

    function getTypeColor(typeName: string) {
      switch (typeName.toLowerCase()) {
        case 'grass':
          return 'green';
        case 'poison':
          return 'purple';
        case 'fire':
          return 'red';
        case 'water':
          return 'blue';
        case 'dark':
          return 'brown';
        case 'ghost':
          return 'pink';
        case 'fighting':
          return 'orange';
        case 'bug':
          return 'yellow';
        case 'ground':
          return 'white';
        default:
          return 'gray';
      }
    }

    watchEffect(() => {
      const pokemonId = route.params.id;
      fetchPokemonDetails(pokemonId as string);
    });

    return {
      pokemonId,
      pokemonDetails,
      getChartData,
      getTypeColor
    };
  }
});
</script>

<template>
  <v-container v-if="pokemonDetails">
    <v-row>
      <v-breadcrumbs
        class="px-0"
        :items="[
          { title: 'All pokemon', disabled: false, href: '/' },
          { title: pokemonDetails.name, disabled: true, href: '#!' }
        ]"
      />
    </v-row>
    <v-row> </v-row>
    <v-row>
      <h1 class="pokemon-name headline py-3">{{ pokemonDetails.name }} #{{ pokemonId }}</h1>
    </v-row>
    <v-row>
      <v-card class="main-card">
        <v-row>
          <v-col md="4" sm="12" class="pa-0">
            <v-img :src="pokemonDetails.imageUrl" height="300px"></v-img>
          </v-col>
          <v-col md="8" sm="12" class="pa-0">
            <v-container>
              <v-row no-gutters>
                <v-col sm="6" md="6">
                  <v-card-title>Type</v-card-title>
                  <v-chip
                    class="ml-6"
                    v-for="type in pokemonDetails.pokemon_v2_pokemontypes"
                    :key="type.pokemon_v2_type.name"
                    :color="getTypeColor(type.pokemon_v2_type.name)"
                    label
                  >
                    {{ type.pokemon_v2_type.name }}
                  </v-chip>
                </v-col>
                <v-col sm="6" md="6">
                  <v-card-title>Abilities</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item
                        class="ability-name"
                        v-for="ability in pokemonDetails.pokemon_v2_pokemonabilities"
                        :key="ability.pokemon_v2_ability.name"
                      >
                        {{ ability.pokemon_v2_ability.name }}
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-col>
                <v-col sm="6" md="6">
                  <v-card-title>Height</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item> {{ pokemonDetails.height / 10 }} meters </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-col>
                <v-col sm="6" md="6">
                  <v-card-title>Weight</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item> {{ pokemonDetails.weight / 10 }} kg </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-row>
      <v-card style="width: 100%; height: auto">
        <v-row>
          <v-col cols="12" md="6">
            <v-card-title>Stats</v-card-title>
            <v-card-text v-if="pokemonDetails.pokemon_v2_pokemonstats">
              <Bar :data="getChartData()" :options="chartOptions" />
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
  </v-container>
  <div v-else><PokeballLoader /></div>
</template>

<style lang="scss" scoped>
.pokemon-name {
  text-transform: capitalize;
}
.main-card {
  width: 100%;

  .ability-name {
    text-transform: capitalize;
  }
}
</style>
