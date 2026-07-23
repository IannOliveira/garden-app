<template>
  <div class="print-page bg-white pa-8">
    <div class="d-print-none d-flex justify-end mb-6">
      <v-btn color="primary" prepend-icon="mdi-printer" @click="imprimir">
        Imprimir Relatório (PDF)
      </v-btn>
    </div>

    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p class="mt-4 text-h6">Gerando relatório...</p>
    </div>

    <div v-else>
      <div class="text-center mb-8">
        <h1 class="text-h4 font-weight-bold mb-2">Relatório de Contas a Receber</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Data de Emissão: {{ new Date().toLocaleDateString('pt-BR') }}
        </p>
      </div>

      <div class="mb-8 text-body-2 bg-grey-lighten-4 pa-4 rounded">
        <h3 class="font-weight-bold mb-2">Filtros Aplicados</h3>
        <v-row dense>
          <v-col cols="12" sm="3" v-if="queryFilters.status">
            <strong>Status:</strong> <span class="text-uppercase">{{ queryFilters.status }}</span>
          </v-col>
          <v-col cols="12" sm="3" v-if="queryFilters.data_inicio">
            <strong>Data Inicial:</strong> {{ formatData(queryFilters.data_inicio) }}
          </v-col>
          <v-col cols="12" sm="3" v-if="queryFilters.data_fim">
            <strong>Data Final:</strong> {{ formatData(queryFilters.data_fim) }}
          </v-col>
          <v-col cols="12" v-if="!queryFilters.status && !queryFilters.data_inicio && !queryFilters.data_fim">
            <strong>Nenhum filtro específico aplicado (Todos os registros)</strong>
          </v-col>
        </v-row>
      </div>

      <div v-for="(grupo, index) in contasAgrupadas" :key="index" class="mb-12" style="page-break-inside: avoid;">
        <div class="bg-grey-lighten-3 pa-3 mb-3 border">
          <h2 class="text-h6 font-weight-bold mb-2 text-primary">Cliente: {{ grupo.cliente?.nome || 'Desconhecido' }}</h2>
          <v-row dense class="text-body-2">
            <v-col cols="6">
              <p class="mb-1"><strong>Telefone:</strong> {{ grupo.cliente?.telefone || 'Não informado' }}</p>
            </v-col>
            <v-col cols="6">
              <p class="mb-1">
                <strong>Endereço:</strong> 
                {{ grupo.cliente?.endereco || 'Não informado' }} 
                <span v-if="grupo.cliente?.numero_casa">, {{ grupo.cliente?.numero_casa }}</span>
              </p>
              <p class="mb-1"><strong>Cidade/UF:</strong> {{ grupo.cliente?.cidade || '--' }} <span v-if="grupo.cliente?.estado">/ {{ grupo.cliente?.estado }}</span></p>
            </v-col>
          </v-row>
        </div>

        <v-table density="compact" class="border">
          <thead class="bg-grey-lighten-4">
            <tr>
              <th class="text-left font-weight-bold py-2">Cód. Venda</th>
              <th class="text-left font-weight-bold py-2">Vencimento</th>
              <th class="text-left font-weight-bold py-2">Status</th>
              <th class="text-right font-weight-bold py-2">Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in grupo.contas" :key="item.id">
              <td class="py-1">#{{ item.faturamento_id || 'N/A' }}</td>
              <td class="py-1">{{ formatData(item.data_vencimento) }}</td>
              <td class="py-1 text-uppercase">{{ item.status }}</td>
              <td class="text-right py-1">R$ {{ parseFloat(item.valor).toFixed(2) }}</td>
            </tr>
          </tbody>
        </v-table>
        
        <div class="d-flex justify-end mt-2 text-body-2 pa-2 bg-grey-lighten-5 border border-t-0">
          <span class="mr-6 text-warning font-weight-medium">Pendente: R$ {{ grupo.totalPendente.toFixed(2) }}</span>
          <span class="mr-6 text-success font-weight-medium">Pago: R$ {{ grupo.totalPago.toFixed(2) }}</span>
          <strong class="text-black">Subtotal do Cliente: R$ {{ grupo.totalGeral.toFixed(2) }}</strong>
        </div>
      </div>

      <div v-if="contas.length === 0" class="text-center py-8 text-medium-emphasis text-h6 border rounded bg-grey-lighten-4">
        Nenhuma conta encontrada com os filtros atuais.
      </div>

      <div class="d-flex justify-end mt-10" v-if="contas.length > 0">
        <v-card variant="outlined" class="pa-5 bg-grey-lighten-4 border-primary border-opacity-25" min-width="350">
          <h3 class="text-h6 font-weight-bold mb-4 text-center">Resumo Geral do Relatório</h3>
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium text-warning">Total Pendente:</span>
            <span class="font-weight-bold">R$ {{ totalPendente.toFixed(2) }}</span>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span class="font-weight-medium text-success">Total Pago:</span>
            <span class="font-weight-bold">R$ {{ totalPago.toFixed(2) }}</span>
          </div>
          <v-divider class="my-3 border-opacity-100" />
          <div class="d-flex justify-space-between">
            <span class="text-h6 font-weight-bold text-primary">Total Geral:</span>
            <span class="text-h6 font-weight-bold text-primary">R$ {{ totalGeral.toFixed(2) }}</span>
          </div>
        </v-card>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ContaReceberService } from '@/services/contaReceberService';

const route = useRoute();
const loading = ref(true);
const contas = ref([]);
const queryFilters = ref({});

const contasAgrupadas = computed(() => {
  const grupos = {};
  contas.value.forEach(c => {
    const cid = c.cliente?.id || 'desconhecido';
    if (!grupos[cid]) {
      grupos[cid] = {
        cliente: c.cliente,
        contas: [],
        totalPendente: 0,
        totalPago: 0,
        totalGeral: 0
      };
    }
    grupos[cid].contas.push(c);
    const val = parseFloat(c.valor) || 0;
    grupos[cid].totalGeral += val;
    if (c.status === 'pendente') grupos[cid].totalPendente += val;
    if (c.status === 'pago') grupos[cid].totalPago += val;
  });
  return Object.values(grupos);
});

const totalPendente = computed(() => {
  return contas.value
    .filter(c => c.status === 'pendente')
    .reduce((sum, c) => sum + parseFloat(c.valor), 0);
});

const totalPago = computed(() => {
  return contas.value
    .filter(c => c.status === 'pago')
    .reduce((sum, c) => sum + parseFloat(c.valor), 0);
});

const totalGeral = computed(() => {
  return contas.value.reduce((sum, c) => sum + parseFloat(c.valor), 0);
});

const formatData = (dataString) => {
  if (!dataString) return '--';
  const d = new Date(dataString);
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};

const imprimir = () => {
  window.print();
};

onMounted(async () => {
  queryFilters.value = route.query;
  try {
    const response = await ContaReceberService.getAll(queryFilters.value);
    contas.value = response.data.data;
    
    setTimeout(() => {
      if (contas.value.length > 0) {
        window.print();
      }
    }, 500);

  } catch (error) {
    console.error("Erro ao gerar relatório", error);
    alert("Erro ao carregar dados do relatório");
  } finally {
    loading.value = false;
  }
});
</script>

<style>
.print-page {
  min-height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  color: #333;
}

@media print {
  .d-print-none {
    display: none !important;
  }
  
  body {
    background-color: white !important;
  }
  
  .print-page {
    margin: 0;
    padding: 0;
    box-shadow: none;
    max-width: none;
  }
}
</style>
