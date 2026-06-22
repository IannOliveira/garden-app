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
          Comece a<br />organizar seu<br />negócio hoje
        </h1>
        <p class="text-body-1 text-white" style="opacity:.75">
          Crie sua conta gratuitamente e tenha<br />controle total da sua operação.
        </p>

        <div class="d-flex flex-wrap ga-3 mt-8">
          <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-check-circle-outline">Grátis</v-chip>
          <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-shield-check-outline">Seguro</v-chip>
          <v-chip color="white" variant="tonal" size="small" prepend-icon="mdi-lightning-bolt-outline">Rápido</v-chip>
        </div>
      </div>

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
          <h2 class="text-h4 font-weight-bold mb-1">Criar conta ✨</h2>
          <p class="text-body-2 text-medium-emphasis">
            Preencha os dados abaixo para começar
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
          <v-row>
            <!-- Primeiro nome -->
            <v-col cols="12" sm="6" class="pb-0">
              <p class="form-label">Primeiro nome</p>
              <v-text-field
                v-model="primeiroNome"
                placeholder="Maria"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-account-outline"
                :error-messages="errors.primeiro_nome"
                hide-details="auto"
                color="primary"
                bg-color="grey-lighten-5"
              />
            </v-col>

            <!-- Sobrenome -->
            <v-col cols="12" sm="6" class="pb-0">
              <p class="form-label">Sobrenome</p>
              <v-text-field
                v-model="sobrenome"
                placeholder="Silva"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-account-outline"
                :error-messages="errors.sobrenome"
                hide-details="auto"
                color="primary"
                bg-color="grey-lighten-5"
              />
            </v-col>

            <!-- Email -->
            <v-col cols="12" class="pb-0">
              <p class="form-label">E-mail</p>
              <v-text-field
                v-model="email"
                placeholder="seu@email.com"
                type="email"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                prepend-inner-icon="mdi-email-outline"
                :error-messages="errors.email"
                hide-details="auto"
                color="primary"
                bg-color="grey-lighten-5"
              />
            </v-col>

            <!-- Senha -->
            <v-col cols="12" class="pb-0">
              <p class="form-label">Senha</p>
              <v-text-field
                v-model="password"
                placeholder="Mínimo 8 caracteres"
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
              />
            </v-col>

            <!-- Submit -->
            <v-col cols="12">
              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                rounded="lg"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                height="52"
              >
                <v-icon start icon="mdi-account-plus-outline" />
                Criar conta
              </v-btn>
            </v-col>
          </v-row>
        </form>

        <!-- Login link -->
        <p class="text-center text-body-2 text-medium-emphasis mt-6">
          Já tem uma conta?
          <RouterLink
            :to="{ name: 'login' }"
            class="text-primary text-decoration-none font-weight-semibold ml-1"
          >
            Fazer login
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/store/auth';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import messages from '@/utils/messages';
import { useRouter } from 'vue-router';

const router       = useRouter();
const errorMessage = ref(null);
const showPassword = ref(false);
const authStore    = useAuth();

const schema = yup.object({
  primeiro_nome: yup.string().required('Primeiro nome é obrigatório.'),
  email:         yup.string().required('E-mail é obrigatório.').email('Insira um e-mail válido.'),
  password:      yup.string().required('Senha é obrigatória.').min(8, 'Mínimo de 8 caracteres.'),
});

const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema: schema });

const submit = handleSubmit((value) => {
  errorMessage.value = null;
  return authStore.registrar(value.primeiro_nome, value.sobrenome, value.email, value.password)
    .then(() => router.push({ name: 'login' }))
    .catch((e) => {
      errorMessage.value = messages[e.response?.data?.error] || 'Erro ao criar conta.';
    });
});

const { value: primeiroNome } = useField('primeiro_nome');
const { value: sobrenome }    = useField('sobrenome');
const { value: email }        = useField('email');
const { value: password }     = useField('password');
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
  background-image: radial-gradient(circle at 20% 80%, rgba(255,255,255,.08) 0%, transparent 50%),
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
  max-width: 480px;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2A3547;
  margin-bottom: 8px;
}
</style>
