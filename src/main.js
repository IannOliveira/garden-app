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

const app = createApp(App)

app.use(VueTheMask)
app.use(pinia)
const meStore = useMe();
meStore.getMe()
  .catch(() =>{})
  .finally( () => {
    app.use(vuetify)
    app.use(router)
    app.mount('#app')
  })
