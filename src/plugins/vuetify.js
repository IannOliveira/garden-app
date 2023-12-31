import {createVuetify} from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import * as directives from 'vuetify/directives';
import {PurpleTheme} from '@/theme/LightTheme';
import {
  VDataTable,
  VDataTableServer,
  VDataTableVirtual,
} from "vuetify/labs/VDataTable";

import { VDatePicker } from "vuetify/labs/components";


export default createVuetify({
  components: {
    VDataTable,
    VDataTableServer,
    VDataTableVirtual,
    VDatePicker,
  },
  directives,

  theme: {
    defaultTheme: 'PurpleTheme',
    themes: {
      PurpleTheme,
    }
  },

  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md'
    },
    VTextField: {
      rounded: 'lg'
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top'
    },
    VNavigationDrawer: {
      class: 'leftSidebar',
    }

  }

});
