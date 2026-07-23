<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Fluxo de Caixa</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Resumo financeiro das suas entradas e saídas
        </p>
      </div>
      <div class="d-flex ga-3">
        <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" @click="fetchCaixa">Atualizar</v-btn>
      </div>
    </div>

    <!-- Resumo Cards -->
    <v-row class="mb-5">
      <v-col cols="12" md="3">
        <v-card rounded="xl" variant="flat" border class="pa-4 bg-lightprimary">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis">Entradas (Dinheiro/PIX)</span>
            <v-icon icon="mdi-cash" color="success" size="24" />
          </div>
          <p class="text-h5 font-weight-bold text-success mb-0">R$ {{ parseFloat(resumo.entradas_outros || 0).toFixed(2) }}</p>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card rounded="xl" variant="flat" border class="pa-4 bg-lightprimary">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis">Entradas (Cartão)</span>
            <v-icon icon="mdi-credit-card" color="primary" size="24" />
          </div>
          <p class="text-h5 font-weight-bold text-primary mb-0">R$ {{ parseFloat(resumo.entradas_cartao || 0).toFixed(2) }}</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card rounded="xl" variant="flat" border class="pa-4 bg-error-lighten-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption font-weight-bold text-uppercase text-medium-emphasis">Saídas (Estornos)</span>
            <v-icon icon="mdi-cash-minus" color="error" size="24" />
          </div>
          <p class="text-h5 font-weight-bold text-error mb-0">R$ {{ parseFloat(resumo.saidas || 0).toFixed(2) }}</p>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card rounded="xl" variant="flat" border class="pa-4" :class="resumo.saldo_geral >= 0 ? 'bg-success' : 'bg-error'">
          <div class="d-flex align-center justify-space-between mb-2">
            <span class="text-caption font-weight-bold text-uppercase text-white">Saldo Líquido</span>
            <v-icon icon="mdi-scale-balance" color="white" size="24" />
          </div>
          <p class="text-h5 font-weight-bold text-white mb-0">R$ {{ parseFloat(resumo.saldo_geral || 0).toFixed(2) }}</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Data Table Card -->
    <v-card variant="flat" border rounded="xl">
      <div class="pa-4 border-b">
        <h3 class="text-subtitle-1 font-weight-bold mb-0">Histórico de Lançamentos</h3>
      </div>
      <v-data-table
        :headers="headers"
        :items="lancamentos"
        :loading="caixaStore.loading"
        hover
        class="bg-transparent"
      >
        <template v-slot:item.tipo="{ item }">
          <v-chip
            size="small"
            :color="item.tipo === 'entrada' ? 'success' : 'error'"
            variant="tonal"
            class="font-weight-bold text-uppercase"
          >
            <v-icon :icon="item.tipo === 'entrada' ? 'mdi-arrow-down' : 'mdi-arrow-up'" size="14" class="mr-1" />
            {{ item.tipo }}
          </v-chip>
        </template>
        
        <template v-slot:item.valor="{ item }">
          <span :class="{'text-success font-weight-bold': item.tipo === 'entrada', 'text-error font-weight-bold': item.tipo === 'saida'}">
            {{ item.tipo === 'entrada' ? '+' : '-' }} R$ {{ parseFloat(item.valor).toFixed(2) }}
          </span>
        </template>

        <template v-slot:item.data_lancamento="{ item }">
          <span class="text-caption font-weight-medium">
            {{ formatData(item.data_lancamento) }}
          </span>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCaixaStore } from '@/store/caixaStore';
import { storeToRefs } from 'pinia';

const caixaStore = useCaixaStore();
const { resumo, lancamentos } = storeToRefs(caixaStore);

const headers = [
  { title: 'Data', key: 'data_lancamento' },
  { title: 'Descrição', key: 'descricao' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Forma Pgto', key: 'forma_pagamento' },
  { title: 'Valor', key: 'valor', align: 'end' },
];

const fetchCaixa = async () => {
  await caixaStore.fetchCaixa();
};

const formatData = (dataString) => {
  if (!dataString) return '--';
  const d = new Date(dataString);
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

onMounted(() => {
  fetchCaixa();
});
</script>
