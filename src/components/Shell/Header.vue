<template>

  <v-navigation-drawer left elevation="0" app class="leftSi debar" v-model="sidebarDrawer">
    <!---Logo part -->
    <div class="pa-4">
      <Logo/>
    </div>


    <v-scroll-y-reverse-transition  >
      <div>

        <!-- <perfect-scrollbar class="scrollnavbar"> -->
        <v-list class="pa-1" >

          <v-list-subheader color="darkText" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold">Menu
          </v-list-subheader>

          <v-list-group>
            <template #activator="{ props }">
              <v-list-item
                prepend-icon="mdi-account-circle"
                v-bind="props"
                rounded
                class="mb-1"
                active-color="primary"
              >
                Cliente
              </v-list-item>
            </template>
            <RouterLink to="/cliente" class="router-link-custom">
            <v-list-item value="cliente" active-color="primary" >
                <v-icon icon="mdi-content-save"/>
                &nbsp;&nbsp;&nbsp;Cadastro
            </v-list-item>
            </RouterLink>
          </v-list-group>


          <v-list-group>
            <template #activator="{ props }">
              <v-list-item
                prepend-icon="mdi-account-circle"
                v-bind="props"
                rounded
                class="mb-1"
                active-color="primary"
              >
                Contas/Fornecedor
              </v-list-item>
            </template>
            <RouterLink to="/contas" class="router-link-custom">
              <v-list-item value="contas" active-color="primary" >
                <v-icon icon="mdi-content-save"/>
                &nbsp;&nbsp;&nbsp;Contas
              </v-list-item>
            </RouterLink>
            <RouterLink to="/fornecedor" class="router-link-custom">
              <v-list-item value="fornecedor" active-color="primary">
                <v-icon icon="mdi-content-save"/>
                &nbsp;&nbsp;&nbsp;Fornecedor
              </v-list-item>
            </RouterLink>
          </v-list-group>
          <v-list-group>
            <template #activator="{ props }">
              <v-list-item
                prepend-icon="mdi-account-circle"
                v-bind="props"
                rounded
                class="mb-1"
                active-color="primary"
              >
                Estoque
              </v-list-item>
            </template>
          <RouterLink to="/" class="router-link-custom">
            <v-list-item value="dashboard" active-color="primary">
              <v-icon icon="mdi-content-save"/>
              &nbsp;&nbsp;&nbsp;Produtos
            </v-list-item>
          </RouterLink>
          </v-list-group>

        </v-list>
        <div class="pa-4" >
          <!-- <ExtraBox />-->
        </div>
        <!-- </perfect-scrollbar> -->
      </div>
    </v-scroll-y-reverse-transition>

  </v-navigation-drawer>

  <v-app-bar elevation="0" height="65">

    <div class="d-flex align-center justify-space-between w-100 border-right border-b">
      <div>
        <v-app-bar-nav-icon class="ms-md-3 ms-sm-5 ms-3"
                            @click="sidebarDrawer = !sidebarDrawer">
        </v-app-bar-nav-icon>

        <!-- Notification
        <NotificationDD />-->
      </div>
      <div>
        <UserDropDown/>
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

<style>
.router-link-custom {
  text-decoration: none;
  color: black;
  background-color: transparent !important;
}
</style>
