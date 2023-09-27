<template>
  <v-container fluid class="pa-3">
    <v-row class="h-100vh d-flex justify-center align-center">
      <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
        <v-card rounded="md" elevation="10" class="px-sm-1 px-0 withbg mx-auto" max-width="500">
          <v-card-item class="pa-sm-8">
            <div class="d-flex justify-center py-4">
              <Logo />
            </div>

            <div v-if="isLoading"
                 class="text-warning text-center">
              Verificando...
            </div>

            <div v-else-if="!isReady"
                 class="text-error text-center">
              Ops! Parece que esse token está inválido.
            </div>

            <div v-else
                 class="text-success text-center"
            >
              Email verificado! <br/>
              Obrigado, {{ state.data.data.primeiro_nome }} por verificar seu email.
            </div>

          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>

    import {useAuth} from "@/store/auth";
    import {useAsyncState} from "@vueuse/core";
    import Logo from "@/components/logo/Logo.vue";
    import {useRoute} from "vue-router";

    const authStore = useAuth();
    const route = useRoute()

    const { state, isReady, isLoading} = useAsyncState(
      authStore.verificarEmail(route.query.token),
    )

</script>
