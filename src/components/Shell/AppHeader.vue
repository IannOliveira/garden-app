<template>
  <v-app-bar elevation="0" height="65" color="surface" border>
    <v-app-bar-nav-icon
      variant="text"
      @click="$emit('toggle-drawer')"
    />

    <v-toolbar-title class="text-body-1">
      Olá, <strong>{{ firstName }}</strong>! 👋
    </v-toolbar-title>

    <v-spacer />

    <v-btn icon variant="text" class="mr-1">
      <v-icon>mdi-bell-outline</v-icon>
    </v-btn>

    <UserDropDown />
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue';
import UserDropDown from '@/components/UserDropDown.vue';
import { useMe } from '@/store/me';

defineEmits(['toggle-drawer']);

const meStore = useMe();
const firstName = computed(() => meStore.user?.primeiro_nome || 'usuário');
</script>
