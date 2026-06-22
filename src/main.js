import App from './App.vue'
import { createApp } from 'vue'

import vuetify from '@/plugins/vuetify';
import router  from '@/router';
import pinia   from '@/store';
import { useMe } from '@/store/me';
import '@/scss/style.scss';
import VueTheMask from 'vue-the-mask';
import Money from 'v-money';

const app = createApp(App)

app.use(VueTheMask)
app.use(pinia)

const meStore = useMe();
meStore.getMe()
  .catch(() => {})
  .finally(() => {
    app.use(vuetify)
    app.use(router)
    app.use(Money)
    app.mount('#app')
  })
