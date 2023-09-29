<template>

  <v-navigation-drawer left elevation="0"  app class="leftSi debar"  v-model="sidebarDrawer">
    <!---Logo part -->
    <div class="pa-5 border-b">
      <Logo />
    </div>

    <div>
      <!-- <perfect-scrollbar class="scrollnavbar"> -->
      <v-list class="pa-1">

        <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold">Menu</v-list-subheader>

        <v-list-item
          rounded
          class="mb-1"
          active-color="primary"
        >
          <v-list-group>
            <template #activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-account-circle">
                Clientes
              </v-list-item>
            </template>
            <v-list-item>
              <v-icon icon="mdi-content-save"/>
              &nbsp;&nbsp;&nbsp;Cadastro
            </v-list-item>
            <v-list-item>
              <v-icon icon="mdi-chart-line"/>
              &nbsp;&nbsp;&nbsp;Relatórios
            </v-list-item>
          </v-list-group>
        </v-list-item>
      </v-list>
      <div class="pa-4">
        <!-- <ExtraBox />-->
      </div>
      <!-- </perfect-scrollbar> -->
    </div>

  </v-navigation-drawer>

  <v-app-bar elevation="0" height="80">
    <div class="d-flex align-center justify-space-between w-100 border-right border-b">
      <div>
        <v-btn class="hidden-lg-and-up ms-md-3 ms-sm-5 ms-3 text-muted" @click="sidebarDrawer = !sideBarDrawer" icon variant="flat"
               size="small">
          <v-icon icon="mdi-menu" />
        </v-btn>

        <!-- Notification
        <NotificationDD />-->
      </div>
      <div class>
        <UserDropDown />
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import {ref} from "vue";
import Logo from "@/components/logo/Logo.vue";
import UserDropDown from "@/components/UserDropDown.vue";
const sidebarDrawer = ref(true);
</script>
