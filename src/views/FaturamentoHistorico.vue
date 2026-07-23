<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Histórico de Faturamento</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Acompanhe todas as vendas realizadas
        </p>
      </div>
      <div class="d-flex ga-3">
        <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" @click="fetchFaturamentos">Atualizar</v-btn>
      </div>
    </div>

    <!-- Data Table Card -->
    <v-card variant="flat" border rounded="xl">
      <v-data-table
        :headers="headers"
        :items="faturamentos"
        :loading="faturamentoStore.loading"
        hover
        class="bg-transparent"
      >
        <template v-slot:item.id="{ item }">
          <span class="font-weight-bold text-primary">#{{ item.id }}</span>
        </template>
        
        <template v-slot:item.cliente.nome="{ item }">
          <span class="font-weight-bold">{{ item.cliente?.nome || 'Desconhecido' }}</span>
        </template>

        <template v-slot:item.total="{ item }">
          <span class="font-weight-bold text-success">R$ {{ parseFloat(item.total).toFixed(2) }}</span>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            size="small"
            :color="item.status === 'concluido' ? 'success' : 'error'"
            variant="tonal"
            class="font-weight-bold text-uppercase"
          >
            {{ item.status || 'CONCLUIDO' }}
          </v-chip>
        </template>

        <template v-slot:item.acoes="{ item }">
          <v-btn
            icon="mdi-eye-outline"
            variant="text"
            color="primary"
            size="small"
            @click="verDetalhes(item)"
          />
          <v-btn
            v-if="item.status !== 'cancelado' && item.status !== 'estornado'"
            icon="mdi-cancel"
            variant="text"
            color="error"
            size="small"
            title="Cancelar Faturamento"
            @click="abrirCancelamento(item)"
          />
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal de Cancelamento -->
    <v-dialog v-model="dialogCancel" max-width="400">
      <v-card rounded="xl">
        <div class="pa-4 bg-error d-flex align-center justify-space-between">
          <h3 class="text-h6 font-weight-bold mb-0 text-white">Estornar Venda</h3>
          <v-btn icon="mdi-close" variant="text" color="white" density="comfortable" @click="dialogCancel = false" />
        </div>
        <v-card-text class="pa-5">
          <p class="text-body-2 mb-4">
            Você está prestes a estornar a venda <strong>#{{ fatAtivo?.id }}</strong> do cliente <strong>{{ fatAtivo?.cliente?.nome }}</strong>.
            Esta ação retornará os itens ao estoque e cancelará as contas a receber associadas.
          </p>
          <v-textarea
            v-model="motivo"
            label="Motivo do Cancelamento"
            variant="outlined"
            density="compact"
            rows="3"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialogCancel = false">Desistir</v-btn>
          <v-btn color="error" variant="flat" :loading="loadingCancel" @click="confirmarCancelamento">Confirmar Estorno</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFaturamentoStore } from '@/store/faturamentoStore';
import { storeToRefs } from 'pinia';

const faturamentoStore = useFaturamentoStore();
const { faturamentos } = storeToRefs(faturamentoStore);

const headers = [
  { title: 'Pedido', key: 'id' },
  { title: 'Cliente', key: 'cliente.nome' },
  { title: 'Forma Pgto', key: 'tipo_pagamento' },
  { title: 'Total', key: 'total' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'acoes', sortable: false, align: 'end' },
];

const dialogCancel = ref(false);
const fatAtivo = ref(null);
const motivo = ref('');
const loadingCancel = ref(false);

const fetchFaturamentos = async () => {
  await faturamentoStore.fetchFaturamentos();
};

const verDetalhes = (item) => {
  // Lógica para abrir um modal com os itens vendidos
  alert(`Visualização de itens em breve! Pedido ${item.id} - Itens: ${item.itens?.length}`);
};

const abrirCancelamento = (item) => {
  fatAtivo.value = item;
  motivo.value = '';
  dialogCancel.value = true;
};

const confirmarCancelamento = async () => {
  loadingCancel.value = true;
  try {
    await faturamentoStore.deleteFaturamento(fatAtivo.value.id, motivo.value);
    dialogCancel.value = false;
    fetchFaturamentos();
  } catch (error) {
    alert(error);
  } finally {
    loadingCancel.value = false;
  }
};

onMounted(() => {
  fetchFaturamentos();
});
</script>
