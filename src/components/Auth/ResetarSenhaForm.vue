<template>
  <div>
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

    <form @submit.prevent="submit">
      <!-- Token -->
      <div class="mb-4">
        <p class="form-label">Token recebido por e-mail</p>
        <v-text-field
          v-model="token"
          placeholder="Cole o token aqui"
          type="text"
          variant="outlined"
          density="comfortable"
          rounded="lg"
          prepend-inner-icon="mdi-key-outline"
          :error-messages="errors.token"
          hide-details="auto"
          color="primary"
          bg-color="grey-lighten-5"
        />
      </div>

      <!-- Nova senha -->
      <div class="mb-6">
        <p class="form-label">Nova senha</p>
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
      </div>

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
        <v-icon start icon="mdi-lock-reset" />
        Redefinir senha
      </v-btn>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/store/auth';
import * as yup from 'yup';
import { useField, useForm } from 'vee-validate';
import messages from '@/utils/messages';

const emits        = defineEmits(['after-reset']);
const errorMessage = ref(null);
const showPassword = ref(false);
const authStore    = useAuth();

const schema = yup.object({
  token:    yup.string().required('Token é obrigatório.'),
  password: yup.string().required('Nova senha é obrigatória.').min(8, 'Mínimo de 8 caracteres.'),
});

const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema: schema });

const submit = handleSubmit((value) => {
  errorMessage.value = null;
  return authStore.resetarSenha(value.token, value.password)
    .then(() => emits('after-reset'))
    .catch((e) => {
      errorMessage.value = messages[e.response?.data?.error] || 'Erro ao redefinir senha.';
    });
});

const { value: token }    = useField('token');
const { value: password } = useField('password');
</script>

<style scoped>
.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2A3547;
  margin-bottom: 8px;
}
</style>
