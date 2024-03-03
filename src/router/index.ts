import { createRouter, createWebHistory } from 'vue-router';
import PokemonListView from '@/views/PokemonListView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: PokemonListView },
    {
      path: '/pokemon/:id',
      name: 'pokemon-details',
      component: () => import('@/views/PokemonDetailsView.vue'),
      props: true
    }
  ]
});

export default router;
