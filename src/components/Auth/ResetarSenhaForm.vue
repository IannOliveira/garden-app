<template>
  <v-alert
    v-if="errorMessage"
    type="error"
    :text="errorMessage"
    :icon="false"
    class="mb-5"
  >
  </v-alert>

  <form @submit="submit">
    <v-row class="d-flex mb-3">
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Token</v-label>
        <v-text-field
          v-model="token"
          variant="outlined"
          type="text"
          color="primary"
          :hide-details="!errors.token"
          :error-messages="errors.token"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">Nova Senha</v-label>
        <v-text-field v-model="password"
                      variant="outlined"
                      type="password"
                      color="primary"
                      :hide-details="!errors.password"
                      :error-messages="errors.password"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-btn type="submit"
               color="primary"
               size="large"
               block
               flat
               :loading="isSubmitting"
               :disabled="isSubmitting"
        >Redefinir senha
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<script setup>
import {ref} from "vue";
import {useAuth} from "@/store/auth";
import * as yup from "yup";
import {useField, useForm} from "vee-validate";
import messages from "@/utils/messages";

const emits = defineEmits(['after-reset']);
const errorMessage = ref(null);
const authStore = useAuth();

const schema = yup.object({
  token: yup.string().required('Token é um campo obrigatório.'),
  password: yup.string().required('Nova senha é um campo obrigatório.').min(8, 'A senha deve conter pelo menos 8 caracteres.')
});

const {handleSubmit, errors, isSubmitting} = useForm({
  validationSchema: schema
});

const submit = handleSubmit((value) => {
  errorMessage.value = null
  return authStore.resetarSenha(value.token, value.password,)
    .then(() => {
      emits('after-reset');
    }).catch((e) => {
      errorMessage.value = messages[e.response.data.error]
    });
})

const {value: token} = useField('token');
const {value: password} = useField('password');

</script>
