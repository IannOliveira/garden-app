<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Contas a Pagar</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ contas.length }} conta{{ contas.length !== 1 ? 's' : '' }} no sistema
        </p>
      </div>
      <v-btn color="error" variant="flat" prepend-icon="mdi-plus" rounded="lg" @click="abrirModal('adicao')">
        Nova Conta
      </v-btn>
    </div>

    <!-- Data Card -->
    <v-card variant="flat" border rounded="xl">
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="contas"
        :search="search"
        :loading="loading"
        hover
        class="bg-transparent"
      >
        <!-- Search -->
        <template v-slot:top>
          <div class="pa-4 pb-2">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Pesquisar contas..."
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details
              clearable
              color="primary"
              style="max-width: 340px"
            />
          </div>
        </template>

        <!-- Dates -->
        <template v-slot:item.data_lancamento="{ value }">{{ formataData(value) }}</template>
        <template v-slot:item.data_vencimento="{ value }">{{ formataData(value) }}</template>

        <!-- Valor -->
        <template v-slot:item.valor="{ value }">
          <span class="font-weight-medium">R$ {{ parseFloat(value || 0).toFixed(2) }}</span>
        </template>

        <!-- Status chip -->
        <template v-slot:item.status="{ value }">
          <v-chip :color="getColor(value)" size="small" variant="flat" class="font-weight-bold">
            {{ value == 1 ? 'ABERTO' : value == 2 ? 'ATRASO' : value == 3 ? 'PAGO' : value }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-tooltip text="Visualizar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-eye-outline" variant="text" color="info" density="comfortable" @click="abrirModal('visualizar', item)" />
              </template>
            </v-tooltip>
            <v-tooltip v-if="item.status != 3" text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" color="primary" density="comfortable" @click="abrirModal('edicao', item)" />
              </template>
            </v-tooltip>
            <v-tooltip v-if="item.status != 3" text="Registrar pagamento" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-cash-check" variant="text" color="success" density="comfortable" @click="abrirModal('pagamento', item)" />
              </template>
            </v-tooltip>
            <v-tooltip text="Excluir" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" color="error" density="comfortable" @click="abrirExcluir(item)" />
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- Empty -->
        <template v-slot:no-data>
          <div class="pa-12 text-center">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-cash-register</v-icon>
            <p class="text-body-2 text-medium-emphasis">Nenhuma conta encontrada.</p>
            <v-btn color="error" variant="tonal" class="mt-3" prepend-icon="mdi-plus" @click="abrirModal('adicao')">
              Adicionar primeira conta
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ── Dialog Add/Edit/View/Pay ── -->
    <EntityDialog
      v-model="isDialogOpen"
      :mode="modo"
      width="900px"
      :title="tituloModal"
    >
      <v-alert v-if="errorMessage" type="error" variant="tonal" rounded="lg" class="mb-4" closable @click:close="errorMessage = null">
        {{ errorMessage }}
      </v-alert>

      <form @submit.prevent="submit">
        <!-- Fornecedor & Documento -->
        <p class="section-label">Identificação</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="8">
            <v-select
              v-model="fornecedor_id"
              label="Fornecedor"
              :items="fornecedores"
              item-title="nome"
              item-value="id"
              :error-messages="errors.fornecedor_id"
              :readonly="modo === 'visualizar' || modo === 'pagamento'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <BaseField v-model="numero_documento" label="Nº do Documento" :errors="errors.numero_documento"
              :readonly="modo === 'visualizar' || modo === 'pagamento'" />
          </v-col>
          <v-col cols="12" md="6">
            <BaseField v-model="nota_fiscal" label="Nota Fiscal" :errors="errors.nota_fiscal"
              :readonly="modo === 'visualizar' || modo === 'pagamento'" />
          </v-col>
        </v-row>

        <!-- Valores -->
        <p class="section-label">Valores</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="valor" label="Valor Total" v-money="moneyOptions" prefix="R$"
              :error-messages="errors.valor"
              :readonly="modo === 'visualizar' || modo === 'pagamento'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="valor_pago" label="Valor Pago" v-money="moneyOptions" prefix="R$"
              :error-messages="errors.valor_pago"
              :readonly="modo === 'visualizar' || modo !== 'pagamento'"
              variant="outlined" density="compact" rounded="lg"
              :color="modo === 'pagamento' ? 'success' : 'primary'"
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <!-- Datas -->
        <p class="section-label">Datas</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="4">
            <v-text-field v-model="data_lancamento" label="Data de Lançamento" type="date" readonly
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="data_vencimento" label="Data de Vencimento" type="date"
              :readonly="modo === 'visualizar' || modo === 'pagamento'"
              :error-messages="errors.data_vencimento"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="data_pagamento" label="Data de Pagamento" type="date"
              :readonly="modo === 'visualizar' || modo !== 'pagamento'"
              :error-messages="errors.data_pagamento"
              variant="outlined" density="compact" rounded="lg"
              :color="modo === 'pagamento' ? 'success' : 'primary'"
              hide-details="auto" />
          </v-col>
        </v-row>

        <!-- Classificação -->
        <p class="section-label">Classificação</p>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-select v-model="tipo_pagamento" label="Tipo de Pagamento"
              :items="['DINHEIRO', 'CARTÃO', 'PIX']"
              :error-messages="errors.tipo_pagamento"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="conta_movimento" label="Conta Movimento"
              :items="['CAIXA', 'CRÉDITO', 'DÉBITO']"
              :error-messages="errors.conta_movimento"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select v-model="plano_contas" label="Plano de Contas"
              :items="['Vale Transporte', 'Comida', 'Mecanico', 'Fornecedor', 'Outros']"
              :error-messages="errors.plano_contas"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto" />
          </v-col>
        </v-row>

        <!-- Actions -->
        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" color="grey-darken-1" rounded="lg" @click="isDialogOpen = false">
            {{ modo === 'visualizar' ? 'Fechar' : 'Cancelar' }}
          </v-btn>
          <v-btn v-if="modo !== 'visualizar'" type="submit"
            :color="modo === 'pagamento' ? 'success' : 'error'"
            variant="flat" rounded="lg" :loading="loading"
            :prepend-icon="modo === 'pagamento' ? 'mdi-cash-check' : 'mdi-content-save-outline'"
          >
            {{ modo === 'pagamento' ? 'Confirmar Pagamento' : 'Salvar' }}
          </v-btn>
        </div>
      </form>
    </EntityDialog>

    <!-- ── Delete Dialog ── -->
    <v-dialog v-model="isDialogExcluir" max-width="420">
      <v-card rounded="xl">
        <div class="pa-5 d-flex align-center ga-3">
          <v-avatar color="error" rounded="lg" size="44">
            <v-icon icon="mdi-trash-can-outline" size="22" color="white" />
          </v-avatar>
          <div>
            <p class="text-subtitle-1 font-weight-bold mb-0">- Excluir Conta</p>
            <p class="text-body-2 text-medium-emphasis mb-0">- Esta ação não pode ser desfeita</p>
          </div>
        </div>
        <v-divider />
        <v-card-text class="pa-5">
          Deseja excluir a conta do fornecedor <strong>{{ selectNome }}</strong>?
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="isDialogExcluir = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" :loading="loading" @click="confirmarExclusao">
            Confirmar exclusão
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useContasStore }     from '@/store/contasStore';
import { useFornecedorStore } from '@/store/fornecedorStore';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import messages from '@/utils/messages';
import BaseField from '@/components/common/BaseField.vue';
import EntityDialog from '@/components/common/EntityDialog.vue';

const contasStore     = useContasStore();
const fornecedorStore = useFornecedorStore();

const { contas, loading }   = storeToRefs(contasStore);
const { fornecedores }       = storeToRefs(fornecedorStore);

const isDialogOpen    = ref(false);
const isDialogExcluir = ref(false);
const modo            = ref('adicao');
const selectedId      = ref(null);
const selectNome      = ref('');
const errorMessage    = ref(null);
const search          = ref('');
const itemsPerPage    = ref(10);

const tituloModal = computed(() => {
  if (modo.value === 'adicao')    return 'Nova Conta';
  if (modo.value === 'edicao')    return 'Editar Conta';
  if (modo.value === 'pagamento') return 'Registrar Pagamento';
  return 'Detalhes da Conta';
});

const schema = yup.object({
  fornecedor_id:  yup.string().required('Fornecedor é obrigatório.'),
  valor:          yup.string().required('Valor é obrigatório.'),
  data_vencimento:yup.date().required('Data de vencimento é obrigatória.'),
  conta_movimento:yup.string().required('Conta movimento é obrigatória.'),
  tipo_pagamento: yup.string().required('Tipo de pagamento é obrigatório.'),
  plano_contas:   yup.string().required('Plano de contas é obrigatório.'),
});

const { handleSubmit, errors, handleReset, setValues } = useForm({ validationSchema: schema });

const { value: fornecedor_id }    = useField('fornecedor_id');
const { value: numero_documento } = useField('numero_documento');
const { value: nota_fiscal }      = useField('nota_fiscal');
const { value: valor }            = useField('valor');
const { value: valor_pago }       = useField('valor_pago');
const { value: data_lancamento }  = useField('data_lancamento');
const { value: data_vencimento }  = useField('data_vencimento');
const { value: data_pagamento }   = useField('data_pagamento');
const { value: tipo_pagamento }   = useField('tipo_pagamento');
const { value: conta_movimento }  = useField('conta_movimento');
const { value: plano_contas }     = useField('plano_contas');

const headers = [
  { title: 'Fornecedor',  align: 'start',  key: 'fornecedor_nome',  sortable: true  },
  { title: 'Lançamento',  align: 'center', key: 'data_lancamento',  sortable: false },
  { title: 'Vencimento',  align: 'center', key: 'data_vencimento',  sortable: false },
  { title: 'Valor',       align: 'center', key: 'valor',            sortable: true  },
  { title: 'Status',      align: 'center', key: 'status',           sortable: false },
  { title: 'Ações',       align: 'end',    key: 'actions',          sortable: false },
];

const moneyOptions = { suffix: '', precision: 2, decimal: '.', thousands: '', allowBlank: false, masked: true };

onMounted(() => {
  contasStore.fetchContas();
  fornecedorStore.fetchFornecedores();
});

const abrirModal = (tipo, item = null) => {
  modo.value = tipo;
  errorMessage.value = null;
  handleReset();
  if (item) {
    selectedId.value = item.id;
    setValues({ fornecedor_id: item.fornecedor_id, numero_documento: item.numero_documento,
      nota_fiscal: item.nota_fiscal, valor: item.valor, valor_pago: item.valor_pago,
      data_lancamento: item.data_lancamento, data_vencimento: item.data_vencimento,
      data_pagamento: item.data_pagamento, tipo_pagamento: item.tipo_pagamento,
      conta_movimento: item.conta_movimento, plano_contas: item.plano_contas });
  } else {
    selectedId.value = null;
    data_lancamento.value = new Date().toISOString().split('T')[0];
  }
  isDialogOpen.value = true;
};

const abrirExcluir = (item) => {
  selectedId.value = item.id;
  selectNome.value = item.fornecedor_nome;
  isDialogExcluir.value = true;
};

const confirmarExclusao = async () => {
  try {
    await contasStore.removeConta(selectedId.value);
    isDialogExcluir.value = false;
  } catch { errorMessage.value = 'Erro ao excluir conta.'; }
};

const getColor = (status) => {
  if (status == 1) return 'primary';
  if (status == 3) return 'success';
  return 'warning';
};

const formataData = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  return date.toLocaleDateString('pt-BR');
};

const submit = handleSubmit(async (values) => {
  try {
    if (modo.value === 'adicao')    await contasStore.addConta(values);
    else if (modo.value === 'edicao')    await contasStore.updateConta(selectedId.value, values);
    else if (modo.value === 'pagamento') await contasStore.payConta(selectedId.value, values);
    isDialogOpen.value = false;
  } catch (e) {
    errorMessage.value = messages[e.response?.data?.error] || 'Ocorreu um erro inesperado.';
  }
});
</script>

<style scoped>
.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(var(--v-theme-error));
  margin-bottom: 10px;
  margin-top: 4px;
}
</style>
