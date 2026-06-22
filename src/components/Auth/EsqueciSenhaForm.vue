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
      <!-- Email -->
      <div class="mb-5">
        <p class="form-label">E-mail cadastrado</p>
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
        <v-icon start icon="mdi-send-outline" />
        Enviar token de recuperação
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

const emits        = defineEmits(['after-request']);
const errorMessage = ref(null);
const authStore    = useAuth();

const schema = yup.object({
  email: yup.string().required('E-mail é obrigatório.').email('Insira um e-mail válido.'),
});

const { handleSubmit, errors, isSubmitting } = useForm({ validationSchema: schema });

const submit = handleSubmit((value) => {
  errorMessage.value = null;
  return authStore.esqueciSenha(value.email)
    .then(() => emits('after-request'))
    .catch((e) => {
      errorMessage.value = messages[e.response?.data?.error] || 'Erro ao enviar token.';
    });
});

const { value: email } = useField('email');
</script>

<style scoped>
.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2A3547;
  margin-bottom: 8px;
}
</style>
