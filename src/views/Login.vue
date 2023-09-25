<template>
  <VContainer>
    <VTextField v-model="email"/>
    <VTextField v-model="password"/>
    <v-btn @click="login">Login</v-btn>
  </VContainer>
</template>

<script setup>
import {useAuth} from "@/store/auth";
import {ref} from "vue";
import {useRouter} from "vue-router";
const router = useRouter();
const authStore = useAuth();
const email = ref('');
const password = ref('');

function login(){
  authStore.login(email.value, password.value).then(() => {
    router.push({name: 'dashboard'});
  });
}
</script>
