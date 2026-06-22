<template>
  <div class="auth-wrapper">

    <!-- Left Panel — Brand -->
    <div class="auth-left d-none d-md-flex flex-column pa-12">
      <div class="d-flex align-center ga-3">
        <v-avatar color="white" rounded="lg" size="44">
          <v-icon icon="mdi-leaf" color="primary" size="26" />
        </v-avatar>
        <span class="text-h6 font-weight-bold text-white">Garden</span>
      </div>

      <div class="my-auto">
        <h1 class="text-h3 font-weight-bold text-white mb-4" style="line-height:1.25">
          Esqueceu<br />sua senha?<br />Sem problemas.
        </h1>
        <p class="text-body-1 text-white" style="opacity:.75">
          Enviaremos um token seguro para<br />você redefinir sua senha rapidamente.
        </p>

        <div class="d-flex ga-3 mt-8">
          <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-email-fast-outline">Via e-mail</v-chip>
          <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-shield-lock-outline">Seguro</v-chip>
        </div>
      </div>

      <p class="text-caption text-white" style="opacity:.5">© {{ new Date().getFullYear() }} Garden Management</p>
    </div>

    <!-- Right Panel -->
    <div class="auth-right d-flex align-center justify-center">
      <div class="auth-form-wrap">

        <!-- Mobile logo -->
        <div class="d-flex d-md-none align-center ga-2 mb-8 justify-center">
          <v-avatar color="primary" rounded="lg" size="38">
            <v-icon icon="mdi-leaf" color="white" size="22" />
          </v-avatar>
          <span class="text-h6 font-weight-bold text-primary">Garden</span>
        </div>

        <!-- Success Alert after reset -->
        <v-alert
          v-if="isReset"
          type="success"
          variant="tonal"
          rounded="lg"
          class="mb-6"
          prepend-icon="mdi-check-circle-outline"
        >
          Senha redefinida com sucesso! Faça login com sua nova senha.
        </v-alert>

        <!-- Step indicator -->
        <div class="step-indicator mb-6">
          <div :class="['step-dot', state === 'forgotPassword' ? 'active' : 'done']" />
          <div class="step-line" />
          <div :class="['step-dot', state === 'resetPassword' ? 'active' : state === 'forgotPassword' ? '' : 'done']" />
        </div>

        <!-- Form Step 1: Solicitar token -->
        <template v-if="state === 'forgotPassword'">
          <div class="mb-8">
            <h2 class="text-h4 font-weight-bold mb-1">Recuperar senha 🔐</h2>
            <p class="text-body-2 text-medium-emphasis">
              Informe seu e-mail e enviaremos um token de redefinição.
            </p>
          </div>
          <EsqueciSenhaForm @after-request="changeToResetPassword" />
        </template>

        <!-- Form Step 2: Redefinir senha -->
        <template v-else-if="state === 'resetPassword'">
          <div class="mb-8">
            <h2 class="text-h4 font-weight-bold mb-1">Nova senha 🔒</h2>
            <p class="text-body-2 text-medium-emphasis">
              Digite o token recebido e escolha uma nova senha.
            </p>
          </div>
          <ResetarSenhaForm @after-reset="changeToForgotPassword" />
        </template>

        <!-- Back to login -->
        <p class="text-center text-body-2 text-medium-emphasis mt-8">
          Lembrou da senha?
          <RouterLink
            :to="{ name: 'login' }"
            class="text-primary text-decoration-none font-weight-semibold ml-1"
          >
            Voltar ao login
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EsqueciSenhaForm from '@/components/Auth/EsqueciSenhaForm.vue';
import ResetarSenhaForm from '@/components/Auth/ResetarSenhaForm.vue';

const state   = ref('forgotPassword');
const isReset = ref(false);

function changeToResetPassword() {
  state.value = 'resetPassword';
}

function changeToForgotPassword() {
  state.value = 'forgotPassword';
  isReset.value = true;
}
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  min-height: 100vh;
}

.auth-left {
  flex: 0 0 40%;
  background: linear-gradient(145deg, #3d5af1 0%, #5D87FF 50%, #49BEFF 100%);
  position: relative;
  overflow: hidden;
}
.auth-left::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255,255,255,.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,.06) 0%, transparent 50%);
  pointer-events: none;
}

.auth-right {
  flex: 1;
  background: #F8F9FC;
  padding: 40px 24px;
}

.auth-form-wrap {
  width: 100%;
  max-width: 440px;
}

/* Step indicator */
.step-indicator {
  display: flex;
  align-items: center;
  gap: 0;
}
.step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #E0E6EF;
  flex-shrink: 0;
  transition: background 0.3s;
}
.step-dot.active { background: #5D87FF; box-shadow: 0 0 0 3px rgba(93,135,255,.2); }
.step-dot.done   { background: #13DEB9; }
.step-line {
  flex: 1;
  height: 2px;
  background: #E0E6EF;
  margin: 0 8px;
}
</style>
