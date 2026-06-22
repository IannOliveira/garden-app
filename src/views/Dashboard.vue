<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold text-textPrimary">Visão Geral</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ formattedDate }}
        </p>
      </div>
    </div>

    <!-- KPI Cards -->
    <v-row class="mb-2">
      <v-col
        v-for="kpi in kpis"
        :key="kpi.title"
        cols="12"
        sm="6"
        xl="3"
      >
        <v-card variant="flat" border rounded="xl" class="overflow-hidden kpi-card">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption font-weight-bold text-medium-emphasis text-uppercase mb-2 letter-spacing">
                  {{ kpi.title }}
                </p>
                <div v-if="isLoading" class="mt-1">
                  <v-progress-circular indeterminate :color="kpi.color" size="22" width="2" />
                </div>
                <p v-else class="text-h3 font-weight-bold mb-0" :class="`text-${kpi.color}`">
                  {{ kpi.value }}
                </p>
                <p class="text-caption text-medium-emphasis mt-2 mb-0">{{ kpi.subtitle }}</p>
              </div>
              <v-avatar :color="kpi.color" rounded="xl" size="58" class="flex-shrink-0">
                <v-icon :icon="kpi.icon" size="28" color="white" />
              </v-avatar>
            </div>
          </v-card-text>
          <!-- Bottom accent bar -->
          <div :class="`bg-${kpi.color}`" style="height: 3px; opacity: 0.5;" />
        </v-card>
      </v-col>
    </v-row>

    <!-- Second Row: Contas Abertas + Summary -->
    <v-row>
      <!-- Recent Open Accounts Table -->
      <v-col cols="12" lg="8">
        <v-card variant="flat" border rounded="xl">
          <v-toolbar color="surface" flat border density="comfortable">
            <v-toolbar-title class="text-subtitle-1 font-weight-bold ml-2">
              Contas em Aberto
            </v-toolbar-title>
            <v-spacer />
            <v-btn
              variant="text"
              color="primary"
              size="small"
              append-icon="mdi-arrow-right"
              class="mr-2"
              :to="{ name: 'listaContas' }"
            >
              Ver todas
            </v-btn>
          </v-toolbar>

          <v-data-table
            :headers="contasHeaders"
            :items="contasAbertas"
            :loading="contasLoading"
            hide-default-footer
            :items-per-page="5"
            class="bg-transparent"
          >
            <template v-slot:item.data_vencimento="{ value }">
              {{ formataData(value) }}
            </template>
            <template v-slot:item.valor="{ value }">
              R$ {{ parseFloat(value || 0).toFixed(2) }}
            </template>
            <template v-slot:item.status="{ value }">
              <v-chip
                :color="value == 2 ? 'warning' : 'primary'"
                size="small"
                variant="flat"
                class="font-weight-bold"
              >
                {{ value == 2 ? 'ATRASO' : 'ABERTO' }}
              </v-chip>
            </template>
            <template v-slot:no-data>
              <div class="pa-10 text-center">
                <v-icon size="56" color="success" class="mb-3">mdi-check-circle-outline</v-icon>
                <p class="text-body-2 text-medium-emphasis">Nenhuma conta em aberto! 🎉</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Donut Summary -->
      <v-col cols="12" lg="4">
        <v-card variant="flat" border rounded="xl" height="100%">
          <v-card-text class="pa-5">
            <p class="text-subtitle-2 font-weight-bold mb-5">Resumo de Contas</p>

            <div
              v-for="item in contasSummary"
              :key="item.label"
              class="d-flex align-center justify-space-between mb-4"
            >
              <div class="d-flex align-center ga-3">
                <v-avatar :color="item.color" size="38" rounded="md">
                  <v-icon :icon="item.icon" size="18" color="white" />
                </v-avatar>
                <div>
                  <p class="text-body-2 mb-0">{{ item.label }}</p>
                  <p class="text-caption text-medium-emphasis mb-0">
                    {{ item.count }} conta{{ item.count !== 1 ? 's' : '' }}
                  </p>
                </div>
              </div>
              <v-chip :color="item.color" variant="tonal" size="small" class="font-weight-bold">
                {{ item.count }}
              </v-chip>
            </div>

            <v-divider class="my-4" />

            <!-- Quick Actions -->
            <p class="text-subtitle-2 font-weight-bold mb-3">Ações Rápidas</p>
            <div class="d-flex flex-column ga-2">
              <v-btn
                variant="tonal"
                color="primary"
                size="small"
                prepend-icon="mdi-account-plus-outline"
                :to="{ name: 'listaClientes' }"
              >
                Novo Cliente
              </v-btn>
              <v-btn
                variant="tonal"
                color="success"
                size="small"
                prepend-icon="mdi-package-variant-plus"
                :to="{ name: 'listaProdutos' }"
              >
                Novo Produto
              </v-btn>
              <v-btn
                variant="tonal"
                color="error"
                size="small"
                prepend-icon="mdi-cash-plus"
                :to="{ name: 'listaContas' }"
              >
                Nova Conta
              </v-btn>
              <v-btn
                variant="tonal"
                color="secondary"
                size="small"
                prepend-icon="mdi-receipt-text-check-outline"
                :to="{ name: 'faturamento' }"
              >
                Novo Faturamento
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useClienteStore }    from '@/store/clienteStore';
import { useProdutoStore }    from '@/store/produtoStore';
import { useFornecedorStore } from '@/store/fornecedorStore';
import { useContasStore }     from '@/store/contasStore';
import { useMe }              from '@/store/me';

const clienteStore    = useClienteStore();
const produtoStore    = useProdutoStore();
const fornecedorStore = useFornecedorStore();
const contasStore     = useContasStore();
const meStore         = useMe();

const { clientes }    = storeToRefs(clienteStore);
const { produtos }    = storeToRefs(produtoStore);
const { fornecedores }= storeToRefs(fornecedorStore);
const { contas }      = storeToRefs(contasStore);

// Loading state — true if any store is fetching
const isLoading    = computed(() => clienteStore.loading || produtoStore.loading || fornecedorStore.loading);
const contasLoading = computed(() => contasStore.loading);

// Formatted date for the subtitle
const formattedDate = computed(() =>
  new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
);

// ─── KPI Cards ───────────────────────────────────────────────────────────────
const kpis = computed(() => [
  {
    title:    'Clientes',
    value:    clientes.value.length,
    icon:     'mdi-account-group-outline',
    color:    'primary',
    subtitle: 'cadastrados no sistema',
  },
  {
    title:    'Produtos',
    value:    produtos.value.length,
    icon:     'mdi-package-variant-closed',
    color:    'success',
    subtitle: 'itens no catálogo',
  },
  {
    title:    'Fornecedores',
    value:    fornecedores.value.length,
    icon:     'mdi-truck-delivery-outline',
    color:    'warning',
    subtitle: 'parceiros ativos',
  },
  {
    title:    'Contas Pendentes',
    value:    contas.value.filter(c => c.status != 3).length,
    icon:     'mdi-cash-clock',
    color:    'error',
    subtitle: 'aguardando pagamento',
  },
]);

// ─── Contas breakdown ─────────────────────────────────────────────────────────
const contasAbertas   = computed(() => contas.value.filter(c => c.status != 3).slice(0, 5));
const contasAtrasadas = computed(() => contas.value.filter(c => String(c.status) === '2'));
const contasPagas     = computed(() => contas.value.filter(c => String(c.status) === '3'));
const contasEmAberto  = computed(() => contas.value.filter(c => String(c.status) === '1'));

const contasSummary = computed(() => [
  { label: 'Em aberto', count: contasEmAberto.value.length,  color: 'primary', icon: 'mdi-clock-outline'           },
  { label: 'Em atraso', count: contasAtrasadas.value.length, color: 'warning', icon: 'mdi-alert-circle-outline'     },
  { label: 'Pagas',     count: contasPagas.value.length,     color: 'success', icon: 'mdi-check-circle-outline'     },
]);

// ─── Table ────────────────────────────────────────────────────────────────────
const contasHeaders = [
  { title: 'Fornecedor',  key: 'fornecedor_nome',  align: 'start'  },
  { title: 'Vencimento',  key: 'data_vencimento',  align: 'center' },
  { title: 'Valor',       key: 'valor',            align: 'center' },
  { title: 'Status',      key: 'status',           align: 'center' },
];

const formataData = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  return date.toLocaleDateString('pt-BR');
};

// ─── Data Fetching ────────────────────────────────────────────────────────────
onMounted(() => {
  Promise.all([
    clienteStore.fetchClientes().catch(() => {}),
    produtoStore.fetchProdutos().catch(() => {}),
    fornecedorStore.fetchFornecedores().catch(() => {}),
    contasStore.fetchContas().catch(() => {}),
  ]);
});
</script>

<style scoped>
.letter-spacing { letter-spacing: 0.06em; }

.kpi-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
}
</style>
