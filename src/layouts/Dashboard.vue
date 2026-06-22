<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      color="surface"
      elevation="0"
      border
      :rail="rail"
      permanent
    >
      <!-- Brand / Logo -->
      <div class="d-flex align-center px-3 gap-2" style="height: 64px;">
        <v-avatar color="primary" rounded="lg" size="38" class="flex-shrink-0">
          <v-icon icon="mdi-leaf" color="white" size="22" />
        </v-avatar>

        <Transition name="slide-fade">
          <div v-if="!rail" class="overflow-hidden ml-2">
            <p class="text-body-1 font-weight-bold text-primary mb-0 lh-1">Garden</p>
            <p class="text-caption text-medium-emphasis mb-0 lh-1">Management</p>
          </div>
        </Transition>

        <v-spacer />

        <v-btn
          v-if="!rail"
          variant="text"
          icon="mdi-chevron-left"
          size="x-small"
          density="comfortable"
          @click.stop="rail = !rail"
        />
      </div>

      <v-divider />

      <!-- Navigation Items -->
      <v-list nav density="compact" class="pa-2 pt-3">
        <v-tooltip
          v-for="item in navItems"
          :key="item.name"
          :text="item.title"
          location="right"
          :disabled="!rail"
        >
          <template v-slot:activator="{ props: tooltipProps }">
            <v-list-item
              v-bind="tooltipProps"
              :to="{ name: item.name }"
              :ripple="false"
              rounded="lg"
              class="mb-1 nav-item"
              :title="rail ? '' : item.title"
              active-class="nav-item--active"
            >
              <template v-slot:prepend>
                <v-avatar
                  :color="item.color"
                  rounded="md"
                  size="30"
                  :class="rail ? '' : 'mr-1'"
                >
                  <v-icon :icon="item.icon" size="16" color="white" />
                </v-avatar>
              </template>
            </v-list-item>
          </template>
        </v-tooltip>
      </v-list>

      <!-- Expand button when railed -->
      <template v-slot:append>
        <div v-if="rail" class="pa-2">
          <v-btn
            block
            variant="text"
            icon="mdi-chevron-right"
            size="small"
            @click="rail = false"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Header -->
    <AppHeader @toggle-drawer="rail = !rail" />

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <RouterView v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </RouterView>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '@/components/Shell/AppHeader.vue';

const drawer = ref(true);
const rail = ref(false);

const navItems = [
  { icon: 'mdi-view-dashboard-outline',    title: 'Dashboard',    name: 'dashboard',       color: 'primary' },
  { icon: 'mdi-account-group-outline',     title: 'Clientes',     name: 'listaClientes',   color: 'info'    },
  { icon: 'mdi-package-variant-closed',    title: 'Produtos',     name: 'listaProdutos',   color: 'success' },
  { icon: 'mdi-truck-delivery-outline',    title: 'Fornecedores', name: 'listaFornecedor', color: 'warning' },
  { icon: 'mdi-cash-register',             title: 'Contas',       name: 'listaContas',     color: 'error'   },
  { icon: 'mdi-receipt-text-check-outline', title: 'Faturamento',  name: 'faturamento',     color: 'secondary' },
];
</script>

<style scoped>
.lh-1 { line-height: 1.2 !important; }

/* Nav item base */
.nav-item {
  transition: background 0.18s ease, color 0.18s ease;
}

/* Active state — subtle tinted bg */
.nav-item--active {
  background: rgb(var(--v-theme-lightprimary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}
.nav-item--active :deep(.v-list-item-title) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}

/* Brand transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}

.v-main {
  min-height: 100vh;
}
</style>
