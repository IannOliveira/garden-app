<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Produtos</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ produtos.length }} produto{{ produtos.length !== 1 ? 's' : '' }} no catálogo
        </p>
      </div>
      <v-btn color="success" variant="flat" prepend-icon="mdi-plus" rounded="lg" @click="abrirModal('adicao')">
        Novo Produto
      </v-btn>
    </div>

    <!-- Data Card -->
    <v-card variant="flat" border rounded="xl">
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="produtos"
        :search="search"
        :loading="loadingStore"
        hover
        class="bg-transparent"
      >
        <!-- Search -->
        <template v-slot:top>
          <div class="pa-4 pb-2">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Pesquisar produtos..."
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

        <!-- Category chip -->
        <template v-slot:item.categoria="{ value }">
          <v-chip size="small" variant="tonal" color="success" class="font-weight-medium">{{ value }}</v-chip>
        </template>

        <!-- Preço -->
        <template v-slot:item.preco="{ value }">
          <span class="font-weight-medium">R$ {{ parseFloat(value).toFixed(2) }}</span>
        </template>

        <!-- Actions -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-end ga-1">
            <v-tooltip text="Visualizar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-eye-outline" variant="text" color="info" density="comfortable" @click="abrirModal('visualizar', item)" />
              </template>
            </v-tooltip>
            <v-tooltip text="Editar" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" color="primary" density="comfortable" @click="abrirModal('edicao', item)" />
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
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-package-variant-closed</v-icon>
            <p class="text-body-2 text-medium-emphasis">Nenhum produto encontrado.</p>
            <v-btn color="success" variant="tonal" class="mt-3" prepend-icon="mdi-plus" @click="abrirModal('adicao')">
              Adicionar primeiro produto
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ── Dialog Add/Edit/View ── -->
    <EntityDialog
      v-model="isDialogOpen"
      :mode="modo"
      width="900px"
      :title="modo === 'adicao' ? 'Novo Produto' : modo === 'edicao' ? 'Editar Produto' : 'Detalhes do Produto'"
    >
      <v-alert v-if="errorMessage" type="error" variant="tonal" rounded="lg" class="mb-4" closable @click:close="errorMessage = null">
        {{ errorMessage }}
      </v-alert>

      <form @submit.prevent="submit">
        <!-- Identificação -->
        <p class="section-label">Identificação</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="8">
            <BaseField v-model="nome_produto" label="Nome do Produto" :errors="errors.nome_produto" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="categoria"
              label="Categoria"
              :items="['Profissional', 'Men', 'Manutencao', 'Acessorios']"
              :error-messages="errors.categoria"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
          <v-col cols="12">
            <BaseField v-model="descricao" label="Descrição" :errors="errors.descricao" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="fabricante"
              label="Fabricante"
              :items="['GARDEN']"
              :error-messages="errors.fabricante"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="quantidade"
              type="number"
              label="Quantidade em Estoque"
              :append-inner-icon="modo !== 'visualizar' ? 'mdi-minus-box' : undefined"
              :prepend-inner-icon="modo !== 'visualizar' ? 'mdi-plus-box' : undefined"
              @click:append-inner="decrement"
              @click:prepend-inner="increment"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
        </v-row>

        <!-- Preços -->
        <p class="section-label">Precificação</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="preco"
              label="Preço de Custo"
              v-money="moneyOptions"
              prefix="R$"
              :error-messages="errors.preco"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="preco_venda"
              label="Preço de Venda"
              v-money="moneyOptions"
              prefix="R$"
              :error-messages="errors.preco_venda"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              :model-value="porcentagemDisplay + '%'"
              label="Margem de Lucro"
              readonly
              variant="outlined" density="compact" rounded="lg"
              :bg-color="parseFloat(porcentagemDisplay) >= 0 ? 'lightsuccess' : 'lighterror'"
              :color="parseFloat(porcentagemDisplay) >= 0 ? 'success' : 'error'"
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Actions -->
        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" color="grey-darken-1" rounded="lg" @click="isDialogOpen = false">
            {{ modo === 'visualizar' ? 'Fechar' : 'Cancelar' }}
          </v-btn>
          <v-btn v-if="modo !== 'visualizar'" type="submit" color="success" variant="flat" rounded="lg"
            :loading="loadingStore" prepend-icon="mdi-content-save-outline">
            Salvar
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
            <p class="text-subtitle-1 font-weight-bold mb-0">Excluir Produto</p>
            <p class="text-body-2 text-medium-emphasis mb-0">Esta ação não pode ser desfeita</p>
          </div>
        </div>
        <v-divider />
        <v-card-text class="pa-5">
          Deseja realmente excluir <strong>{{ selectNome }}</strong>?
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" rounded="lg" @click="isDialogExcluir = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" :loading="loadingStore" @click="confirmarExclusao">
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
import { useProdutoStore } from '@/store/produtoStore';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import messages from '@/utils/messages';
import BaseField from '@/components/common/BaseField.vue';
import EntityDialog from '@/components/common/EntityDialog.vue';

const produtoStore = useProdutoStore();
const { produtos, loading: loadingStore } = storeToRefs(produtoStore);

const isDialogOpen    = ref(false);
const isDialogExcluir = ref(false);
const modo            = ref('adicao');
const selectedId      = ref(null);
const selectNome      = ref('');
const errorMessage    = ref(null);
const search          = ref('');
const itemsPerPage    = ref(10);

const schema = yup.object({
  nome_produto: yup.string().required('Nome é obrigatório.'),
  descricao:    yup.string().required('Descrição é obrigatória.'),
  categoria:    yup.string().required('Categoria é obrigatória.'),
  fabricante:   yup.string().required('Fabricante é obrigatório.'),
  preco:        yup.string().required('Preço de custo é obrigatório.'),
  preco_venda:  yup.string().required('Preço de venda é obrigatório.'),
});

const { handleSubmit, errors, handleReset, setValues } = useForm({ validationSchema: schema });

const { value: nome_produto } = useField('nome_produto');
const { value: descricao }    = useField('descricao');
const { value: categoria }    = useField('categoria');
const { value: fabricante }   = useField('fabricante');
const { value: quantidade }   = useField('quantidade');
const { value: preco }        = useField('preco');
const { value: preco_venda }  = useField('preco_venda');

const headers = [
  { title: 'Produto',   align: 'start',  key: 'nome_produto', sortable: true  },
  { title: 'Categoria', align: 'center', key: 'categoria',    sortable: true  },
  { title: 'Preço',     align: 'center', key: 'preco',        sortable: true  },
  { title: 'Ações',     align: 'end',    key: 'actions',      sortable: false },
];

const moneyOptions = { suffix: '', precision: 2, decimal: '.', thousands: '', allowBlank: false, masked: true };

const porcentagemDisplay = computed(() => {
  const custo = parseFloat(preco.value) || 0;
  const venda = parseFloat(preco_venda.value) || 0;
  if (custo > 0) return (((venda - custo) / custo) * 100).toFixed(2);
  return '0.00';
});

onMounted(() => produtoStore.fetchProdutos());

const increment = () => { quantidade.value = (parseInt(quantidade.value) || 0) + 1; };
const decrement = () => { if (quantidade.value > 0) quantidade.value = (parseInt(quantidade.value) || 0) - 1; };

const abrirModal = (tipo, item = null) => {
  modo.value = tipo;
  errorMessage.value = null;
  handleReset();
  if (item) {
    selectedId.value = item.id;
    setValues({ nome_produto: item.nome_produto, descricao: item.descricao, categoria: item.categoria,
      fabricante: item.fabricante, quantidade: item.quantidade, preco: item.preco, preco_venda: item.preco_venda });
  } else {
    selectedId.value = null;
    quantidade.value = 0;
  }
  isDialogOpen.value = true;
};

const abrirExcluir = (item) => {
  selectedId.value = item.id;
  selectNome.value = item.nome_produto;
  isDialogExcluir.value = true;
};

const confirmarExclusao = async () => {
  try {
    await produtoStore.removeProduto(selectedId.value);
    isDialogExcluir.value = false;
    selectedId.value = null;
  } catch { errorMessage.value = 'Erro ao excluir produto.'; }
};

const submit = handleSubmit(async (values) => {
  try {
    if (modo.value === 'adicao') await produtoStore.addProduto(values);
    else                         await produtoStore.updateProduto(selectedId.value, values);
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
  color: rgb(var(--v-theme-success));
  margin-bottom: 10px;
  margin-top: 4px;
}
</style>
