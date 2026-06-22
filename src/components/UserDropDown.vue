<template>
  <v-menu :close-on-content-click="false" location="bottom end">
    <template v-slot:activator="{ props }">
      <v-btn variant="text" v-bind="props" icon class="mr-2">
        <v-avatar size="36" color="primary" rounded="lg">
          <span class="text-subtitle-2 font-weight-bold text-white">{{ initials }}</span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card min-width="240" rounded="xl" elevation="10" class="mt-1">
      <!-- User Info -->
      <div class="pa-4 d-flex align-center ga-3">
        <v-avatar color="primary" size="46" rounded="lg">
          <span class="text-h6 font-weight-bold text-white">{{ initials }}</span>
        </v-avatar>
        <div class="overflow-hidden">
          <p class="text-body-2 font-weight-bold mb-0 text-truncate">{{ fullName }}</p>
          <p class="text-caption text-medium-emphasis mb-0 text-truncate">{{ user?.email }}</p>
        </div>
      </div>

      <v-divider />

      <div class="pa-3">
        <v-btn
          color="error"
          variant="tonal"
          block
          rounded="lg"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Sair da conta
        </v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { computed } from 'vue';
import { useAuth } from '@/store/auth';
import { useMe } from '@/store/me';
import { useRouter } from 'vue-router';

const authStore = useAuth();
const meStore = useMe();
const router = useRouter();

const user = computed(() => meStore.user);

const fullName = computed(() => {
  const u = user.value;
  if (!u) return 'Usuário';
  return [u.primeiro_nome, u.sobrenome].filter(Boolean).join(' ');
});

const initials = computed(() =>
  fullName.value.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
);

function logout() {
  authStore.logout().then(() => router.push({ name: 'login' }));
}
</script>
