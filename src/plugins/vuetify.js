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
    VBtn: {
      style: 'letter-spacing: 0; font-weight: 600;',
    },
    VCard: {
      rounded: 'lg',
    },
    VTooltip: {
      location: 'top',
    },
    VNavigationDrawer: {
      class: 'leftSidebar',
    },
  }

});
