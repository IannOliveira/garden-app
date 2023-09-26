<template>
  <VContainer>
    <VTextField v-model="primeiroNome"/>
    <VTextField v-model="sobrenome"/>
    <VTextField type="email" v-model="email"/>
    <VTextField type="password" v-model="password"/>
    <v-btn @click="registrar">Cadastrar</v-btn>
  </VContainer>
</template>

<script setup>

import {ref} from "vue";
import {useAuth} from "@/store/auth";

const primeiroNome = ref('');
const sobrenome = ref('');
const email = ref('');
const password = ref('');

function registrar() {
  const authStore = useAuth();
  authStore.registrar(primeiroNome.value, sobrenome.value, email.value, password.value).then((r) => {
    if (r) {
      primeiroNome.value = '',
      sobrenome.value = '',
      email.value = '',
      password.value = ''
    }

  });

}


</script>
