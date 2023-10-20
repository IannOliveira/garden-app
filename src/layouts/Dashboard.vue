<template>
  <v-app>
    <!-- <VerticalSidebarVue />
    <VerticalHeaderVue  /> -->
    <Header/>


    <v-main>
      <v-container fluid class="page-wrapper" >
        <div class="maxWidth">
          <RouterView />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import Header from "@/components/Shell/Header.vue";
</script>
