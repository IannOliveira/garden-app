import { loadFonts } from "@/plugins/webfontloader";
loadFonts()

import './axios'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import pinia from "@/store";
import {useMe} from "@/store/me";
import '@/scss/style.scss';
import VueTheMask from 'vue-the-mask'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import Money from 'v-money';

const app = createApp(App)

app.component('EasyDataTable', Vue3EasyDataTable);
app.use(VueTheMask)
app.use(pinia)
const meStore = useMe();
meStore.getMe()
  .catch(() =>{})
  .finally( () => {
    app.use(vuetify)
    app.use(router)
    app.use(Money)
    app.mount('#app')
  })
