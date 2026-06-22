<template>
  <div class="auth-wrapper">

    <!-- Left Panel — Brand -->
    <div class="auth-left d-none d-md-flex flex-column pa-12">
      <!-- Logo -->
      <div class="d-flex align-center ga-3">
        <v-avatar color="white" rounded="lg" size="44">
          <v-icon icon="mdi-leaf" color="primary" size="26" />
        </v-avatar>
        <span class="text-h6 font-weight-bold text-white">Garden</span>
      </div>

      <!-- Headline centered -->
      <div class="my-auto">
        <h1 class="text-h3 font-weight-bold text-white mb-4" style="line-height:1.25">
          Gerencie seu<br />negócio com<br />inteligência
        </h1>
        <p class="text-body-1 text-white" style="opacity:.75">
          Clientes, produtos, fornecedores e contas<br />em um único lugar, de forma simples.
        </p>

        <div class="d-flex ga-3 mt-8">
          <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-account-group-outline">Clientes</v-chip>
          <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-package-variant-closed">Produtos</v-chip>
          <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-cash-register">Contas</v-chip>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-caption text-white" style="opacity:.5">© {{ new Date().getFullYear() }} Garden Management</p>
    </div>

    <!-- Right Panel — Form -->
    <div class="auth-right d-flex align-center justify-center">
      <div class="auth-form-wrap">
        <!-- Mobile logo -->
        <div class="d-flex d-md-none align-center ga-2 mb-8 justify-center">
          <v-avatar color="primary" rounded="lg" size="38">
            <v-icon icon="mdi-leaf" color="white" size="22" />
          </v-avatar>
          <span class="text-h6 font-weight-bold text-primary">Garden</span>
        </div>

        <!-- Heading -->
        <div class="mb-8">
          <h2 class="text-h4 font-weight-bold mb-1">Bem-vindo de volta 👋</h2>
          <p class="text-body-2 text-medium-emphasis">
            Acesse sua conta para continuar
          </p>
        </div>

        <!-- Alert -->
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          rounded="lg"
          class="mb-5"
          closable
          @click:close="errorMessage = null"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- Form -->
        <form @submit.prevent="submit">
          <!-- Email -->
          <div class="mb-4">
            <p class="form-label">E-mail</p>
            <v-text-field
              v-model="email"
              placeholder="seu@email.com"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              prepend-inner-icon="mdi-email-outline"
              :error-messages="errors.email"
              hide-details="auto"
              color="primary"
              bg-color="grey-lighten-5"
            />
          </div>

          <!-- Password -->
          <div class="mb-2">
            <div class="d-flex align-center justify-space-between">
              <p class="form-label mb-0">Senha</p>
              <RouterLink
                :to="{ name: 'esqueciSenha' }"
                class="text-caption text-primary text-decoration-none font-weight-semibold"
              >
                Esqueceu a senha?
              </RouterLink>
            </div>
            <v-text-field
              v-model="password"
              placeholder="••••••••"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              @click:append-inner="showPassword = !showPassword"
              :error-messages="errors.password"
              hide-details="auto"
              color="primary"
              bg-color="grey-lighten-5"
              class="mt-2"
            />
          </div>

          <!-- Submit -->
          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            rounded="lg"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="mt-6"
            height="52"
          >
            <v-icon start icon="mdi-login" />
            Entrar
          </v-btn>
        </form>

        <!-- Register link -->
        <p class="text-center text-body-2 text-medium-emphasis mt-8">
          Não tem uma conta?
          <RouterLink
            :to="{ name: 'cadastrar' }"
            class="text-primary text-decoration-none font-weight-semibold ml-1"
          >
            Criar conta grátis
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/store/auth';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import messages from '@/utils/messages';
import { useRouter } from 'vue-router';

const errorMessage  = ref(null);
const showPassword  = ref(false);
const router        = useRouter();
const authStore     = useAuth();

const schema = yup.object({
  email:    yup.string().required('E-mail é obrigatório.').email('Insira um e-mail válido.'),
  password: yup.string().required('Senha é obrigatória.'),
});

const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema: schema });
const { value: email }    = useField('email');
const { value: password } = useField('password');

const submit = handleSubmit((values) => {
  errorMessage.value = null;
  return authStore.login(values.email, values.password)
    .then(() => router.push({ name: 'dashboard' }))
    .catch((e) => {
      errorMessage.value = messages[e.response?.data?.error] || 'Credenciais inválidas.';
    });
});
</script>

<style scoped>
/* ── Layout ── */
.auth-wrapper {
  display: flex;
  min-height: 100vh;
}

/* Left brand panel */
.auth-left {
  flex: 0 0 42%;
  background: linear-gradient(145deg, #3d5af1 0%, #5D87FF 50%, #49BEFF 100%);
  position: relative;
  overflow: hidden;
}
.auth-left::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 80%, rgba(255,255,255,.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255,255,255,.06) 0%, transparent 50%);
  pointer-events: none;
}

/* Right form panel */
.auth-right {
  flex: 1;
  background: #F8F9FC;
  padding: 40px 24px;
}

.auth-form-wrap {
  width: 100%;
  max-width: 420px;
}

/* Field label */
.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2A3547;
  margin-bottom: 8px;
}
</style>
