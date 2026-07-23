<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Contas a Receber</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Gerencie recebimentos pendentes de clientes
        </p>
      </div>
      <div class="d-flex ga-3">
        <v-btn color="primary" variant="flat" prepend-icon="mdi-file-chart-outline" @click="dialogFiltros = true">Filtros / Relatórios</v-btn>
        <v-btn color="primary" variant="tonal" prepend-icon="mdi-refresh" @click="fetchContas">Atualizar</v-btn>
      </div>
    </div>

    <!-- Data Table Card -->
    <v-card variant="flat" border rounded="xl">
      <v-data-table
        :headers="headers"
        :items="contas"
        :loading="contaReceberStore.loading"
        hover
        class="bg-transparent"
        hide-default-footer
        :items-per-page="-1"
      >
        <template v-slot:item.cliente.nome="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar color="primary" rounded="md" size="36" class="mr-3">
              <span class="text-caption font-weight-bold text-white">
                {{ item.cliente?.nome?.substring(0,2).toUpperCase() || '--' }}
              </span>
            </v-avatar>
            <div>
              <p class="text-body-2 font-weight-bold mb-0">{{ item.cliente?.nome || 'Desconhecido' }}</p>
              <p class="text-caption text-medium-emphasis mb-0">Venda #{{ item.faturamento_id }}</p>
            </div>
          </div>
        </template>

        <template v-slot:item.valor="{ item }">
          <span class="font-weight-bold text-success">R$ {{ parseFloat(item.valor).toFixed(2) }}</span>
        </template>

        <template v-slot:item.data_vencimento="{ item }">
          <span :class="{'text-error font-weight-bold': isAtrasado(item), 'text-medium-emphasis': !isAtrasado(item)}">
            {{ formatData(item.data_vencimento) }}
          </span>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            size="small"
            :color="getStatusColor(item.status)"
            variant="tonal"
            class="font-weight-bold text-uppercase"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:item.acoes="{ item }">
          <v-btn
            v-if="item.status === 'pendente'"
            color="success"
            variant="tonal"
            size="small"
            rounded="lg"
            prepend-icon="mdi-cash-check"
            @click="abrirBaixa(item)"
          >
            Dar Baixa
          </v-btn>
          <span v-else class="text-caption text-medium-emphasis">
            Pago em {{ formatData(item.data_pagamento) }}
          </span>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog Dar Baixa -->
    <v-dialog v-model="dialogBaixa" max-width="400">
      <v-card rounded="xl">
        <div class="pa-4 bg-success d-flex align-center justify-space-between">
          <h3 class="text-h6 font-weight-bold mb-0 text-white">Registrar Pagamento</h3>
          <v-btn icon="mdi-close" variant="text" color="white" density="comfortable" @click="dialogBaixa = false" />
        </div>
        <v-card-text class="pa-5">
          <p class="text-body-2 mb-4">
            Confirme o recebimento do cliente <strong>{{ contaAtiva?.cliente?.nome }}</strong> no valor de <strong class="text-success">R$ {{ contaAtiva?.valor }}</strong>.
          </p>
          <v-text-field
            v-model="baixaData"
            label="Data do Pagamento"
            type="date"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          <v-select
            v-model="baixaForma"
            label="Forma de Pagamento"
            :items="['DINHEIRO', 'PIX', 'CARTÃO DE DÉBITO', 'CARTÃO DE CRÉDITO', 'TRANSFERÊNCIA']"
            variant="outlined"
            density="compact"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialogBaixa = false">Cancelar</v-btn>
          <v-btn color="success" variant="flat" :loading="loadingPagar" @click="confirmarBaixa">Confirmar Baixa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Filtros -->
    <v-dialog v-model="dialogFiltros" max-width="500">
      <v-card rounded="xl">
        <div class="pa-4 bg-primary d-flex align-center justify-space-between">
          <h3 class="text-h6 font-weight-bold mb-0 text-white">Relatórios e Filtros</h3>
          <v-btn icon="mdi-close" variant="text" color="white" density="comfortable" @click="dialogFiltros = false" />
        </div>
        <v-card-text class="pa-5">
          <v-row dense>
            <v-col cols="12">
              <v-autocomplete
                v-model="filtros.cliente_id"
                :items="clienteStore.clientes"
                item-title="nome"
                item-value="id"
                label="Cliente"
                variant="outlined"
                density="compact"
                clearable
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="filtros.status"
                :items="['pendente', 'pago', 'cancelado']"
                label="Status"
                variant="outlined"
                density="compact"
                clearable
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="filtros.data_inicio"
                label="Data Inicial"
                type="date"
                variant="outlined"
                density="compact"
                clearable
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="filtros.data_fim"
                label="Data Final"
                type="date"
                variant="outlined"
                density="compact"
                clearable
                hide-details="auto"
                class="mb-3"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-btn variant="text" color="grey" @click="limparFiltros">Limpar</v-btn>
          <v-spacer />
          <v-btn color="secondary" variant="tonal" prepend-icon="mdi-printer" @click="gerarRelatorio">Gerar PDF</v-btn>
          <v-btn color="primary" variant="flat" @click="aplicarFiltros">Aplicar Filtros</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useContaReceberStore } from '@/store/contaReceberStore';
import { useClienteStore } from '@/store/clienteStore';
import { storeToRefs } from 'pinia';

const contaReceberStore = useContaReceberStore();
const clienteStore = useClienteStore();
const router = useRouter();

const { contas } = storeToRefs(contaReceberStore);

const headers = [
  { title: 'Cliente', key: 'cliente.nome' },
  { title: 'Valor', key: 'valor' },
  { title: 'Vencimento', key: 'data_vencimento' },
  { title: 'Forma Pgto', key: 'forma_pagamento' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'acoes', sortable: false, align: 'end' },
];

const dialogBaixa = ref(false);
const contaAtiva = ref(null);
const baixaData = ref('');
const baixaForma = ref('');
const loadingPagar = ref(false);

const dialogFiltros = ref(false);
const filtros = ref({
  cliente_id: null,
  status: null,
  data_inicio: null,
  data_fim: null
});

const fetchContas = async () => {
  await contaReceberStore.fetchContas();
};

const aplicarFiltros = async () => {
  await contaReceberStore.fetchContas(filtros.value);
  dialogFiltros.value = false;
};

const limparFiltros = () => {
  filtros.value = { cliente_id: null, status: null, data_inicio: null, data_fim: null };
  aplicarFiltros();
};

const gerarRelatorio = () => {
  const query = { ...filtros.value };
  Object.keys(query).forEach(key => {
    if (query[key] === null || query[key] === '') {
      delete query[key];
    }
  });
  
  const url = router.resolve({ name: 'relatorioContasReceber', query }).href;
  window.open(url, '_blank');
};

const formatData = (dataString) => {
  if (!dataString) return '--';
  const d = new Date(dataString);
  // Ajuste fuso se necessário
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const isAtrasado = (item) => {
  if (item.status !== 'pendente') return false;
  return new Date(item.data_vencimento) < new Date(new Date().toDateString());
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pago': return 'success';
    case 'pendente': return 'warning';
    case 'cancelado': return 'error';
    default: return 'grey';
  }
};

const abrirBaixa = (item) => {
  contaAtiva.value = item;
  baixaData.value = new Date().toISOString().split('T')[0];
  baixaForma.value = item.forma_pagamento || 'DINHEIRO';
  dialogBaixa.value = true;
};

const confirmarBaixa = async () => {
  loadingPagar.value = true;
  try {
    await contaReceberStore.pagarConta(contaAtiva.value.id, {
      data_pagamento: baixaData.value,
      forma_pagamento: baixaForma.value
    });
    dialogBaixa.value = false;
    fetchContas();
  } catch (error) {
    alert(error);
  } finally {
    loadingPagar.value = false;
  }
};

onMounted(() => {
  clienteStore.fetchClientes();
  fetchContas();
});
</script>
