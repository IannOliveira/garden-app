<template>
  <div>

    <div v-if="isLoading">
      Verificando
    </div>
    <div v-else-if="!isReady">
      Ops! Parece que esse token está inválido!
    </div>
    <div v-else>
      Email verificado! <br/>
      Obrigado, {{ state.data.data.primeiro_nome }} por verificar seu email.
    </div>

  </div>
</template>

<script setup>

    import {useAuth} from "@/store/auth";
    import {useAsyncState} from "@vueuse/core";
    import {useRoute} from "vue-router";

    const authStore = useAuth();
    const route = useRoute()

    const { state, isReady, isLoading} = useAsyncState(
      authStore.verificarEmail(route.query.token),
    )

</script>
