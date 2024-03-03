import './assets/main.scss';

import '@mdi/font/css/materialdesignicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import { createApolloProvider } from '@vue/apollo-option';

import App from '@/App.vue';
import router from '@/router';
import client from '@/graphql/apolloClient';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
});

const apolloProvider = createApolloProvider({
  defaultClient: client
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(apolloProvider);

app.mount('#app');
