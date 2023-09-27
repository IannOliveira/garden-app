<template>
  <div>
    <template v-if="state === 'forgotPassword'">
      <div>Esqueci Senha</div>


      <VTextField v-model="email"/>
      <VBtn @click="forgotPassword()">Solicitar token</VBtn>
    </template>


    <template v-else-if="state === 'resetPassword'">
      <div>Resetar Senha</div>


      <VTextField v-model="token"/>
      <VTextField type="password" v-model="password"/>
      <VBtn @click="resetPassword()">Redefinir Senha</VBtn>
      <a href="" @click.stop.prevent="changeToForgotPassword">Voltar</a>
    </template>


  </div>
</template>


<script setup>
import {ref} from "vue";
import {useAuth} from "@/store/auth";

const email = ref();
const token = ref();
const password = ref();
const state = ref('forgotPassword');
function forgotPassword(){
  const authStore = useAuth();
  authStore.esqueciSenha(email.value)
    .then(() =>{
      changeToResetPassword()
    });
}

function resetPassword(){
  const authStore = useAuth();
  authStore.resetarSenha(token.value, password.value)
    .then(() =>{
      changeToForgotPassword()
    });
}

function changeToResetPassword() {
  state.value = 'resetPassword'
}

function changeToForgotPassword() {
  email.value = ''
  password.value = ''
  token.value = ''
  state.value = 'forgotPassword'
}

</script>
