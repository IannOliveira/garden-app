<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Fornecedores</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ fornecedores.length }} fornecedor{{ fornecedores.length !== 1 ? 'es' : '' }} cadastrado{{ fornecedores.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <v-btn color="warning" variant="flat" prepend-icon="mdi-truck-plus-outline" rounded="lg" @click="abrirModal('adicao')">
        Novo Fornecedor
      </v-btn>
    </div>

    <!-- Data Card -->
    <v-card variant="flat" border rounded="xl">
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="fornecedores"
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
              placeholder="Pesquisar fornecedores..."
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

        <!-- Name with avatar -->
        <template v-slot:item.nome="{ value }">
          <div class="d-flex align-center ga-3 py-1">
            <v-avatar color="warning" rounded="md" size="34" class="mr-3">
              <span class="text-caption font-weight-bold text-white">
                {{ value?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() }}
              </span>
            </v-avatar>
            <span class="font-weight-medium">{{ value }}</span>
          </div>
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
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-truck-delivery-outline</v-icon>
            <p class="text-body-2 text-medium-emphasis">Nenhum fornecedor encontrado.</p>
            <v-btn color="warning" variant="tonal" class="mt-3" prepend-icon="mdi-plus" @click="abrirModal('adicao')">
              Adicionar primeiro fornecedor
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ── Dialog Add/Edit/View ── -->
    <EntityDialog
      v-model="isDialogOpen"
      :mode="modo"
      width="960px"
      :title="modo === 'adicao' ? 'Novo Fornecedor' : modo === 'edicao' ? 'Editar Fornecedor' : 'Detalhes do Fornecedor'"
    >
      <v-alert v-if="errorMessage" type="error" variant="tonal" rounded="lg" class="mb-4" closable @click:close="errorMessage = null">
        {{ errorMessage }}
      </v-alert>

      <form @submit.prevent="submit">
        <!-- Identificação -->
        <p class="section-label">Dados da Empresa</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="4">
            <BaseField v-model="nome" label="Nome / Fantasia" :errors="errors.nome" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="4">
            <BaseField v-model="razao_social" label="Razão Social" :errors="errors.razao_social" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="4">
            <BaseField v-model="cpf_cnpj" label="CPF / CNPJ" :errors="errors.cpf_cnpj" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="4">
            <BaseField v-model="inscricao_estadual" label="Inscrição Estadual" :errors="errors.inscricao_estadual" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="telefone"
              label="Celular"
              v-mask="'(##)#####-####'"
              :error-messages="errors.telefone"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
        </v-row>

        <!-- Endereço -->
        <p class="section-label">Endereço</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="6">
            <BaseField v-model="endereco" label="Endereço" :errors="errors.endereco" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="6" md="2">
            <BaseField v-model="numero" label="Nº" :errors="errors.numero" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="6" md="4">
            <BaseField v-model="bairro" label="Bairro" :errors="errors.bairro" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="cep" label="CEP" v-mask="'#####-###'"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="cidade" label="Cidade"
              :items="['Belém', 'Abaetetuba', 'Ananindeua']"
              :error-messages="errors.cidade"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="estado" label="Estado"
              :items="['PA', 'AP', 'TO']"
              :error-messages="errors.estado"
              :readonly="modo === 'visualizar'"
              variant="outlined" density="compact" rounded="lg" color="primary" hide-details="auto"
            />
          </v-col>
        </v-row>

        <!-- Actions -->
        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" color="grey-darken-1" rounded="lg" @click="isDialogOpen = false">
            {{ modo === 'visualizar' ? 'Fechar' : 'Cancelar' }}
          </v-btn>
          <v-btn v-if="modo !== 'visualizar'" type="submit" color="warning" variant="flat" rounded="lg"
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
            <p class="text-subtitle-1 font-weight-bold mb-0">Excluir Fornecedor</p>
            <p class="text-body-2 text-medium-emphasis mb-0">Esta ação não pode ser desfeita</p>
          </div>
        </div>
        <v-divider />
        <v-card-text class="pa-5">
          Deseja realmente excluir o fornecedor <strong>{{ selectNome }}</strong>?
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
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useFornecedorStore } from '@/store/fornecedorStore';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import messages from '@/utils/messages';
import BaseField from '@/components/common/BaseField.vue';
import EntityDialog from '@/components/common/EntityDialog.vue';

const fornecedorStore = useFornecedorStore();
const { fornecedores, loading: loadingStore } = storeToRefs(fornecedorStore);

const isDialogOpen    = ref(false);
const isDialogExcluir = ref(false);
const modo            = ref('adicao');
const selectedId      = ref(null);
const selectNome      = ref('');
const errorMessage    = ref(null);
const search          = ref('');
const itemsPerPage    = ref(10);

const schema = yup.object({
  nome:     yup.string().required('Nome é obrigatório.'),
  endereco: yup.string().required('Endereço é obrigatório.'),
  estado:   yup.string().required('Estado é obrigatório.'),
  cidade:   yup.string().required('Cidade é obrigatória.'),
  bairro:   yup.string().required('Bairro é obrigatório.'),
});

const { handleSubmit, errors, handleReset, setValues } = useForm({ validationSchema: schema });

const { value: nome }               = useField('nome');
const { value: cpf_cnpj }           = useField('cpf_cnpj');
const { value: inscricao_estadual } = useField('inscricao_estadual');
const { value: razao_social }       = useField('razao_social');
const { value: endereco }           = useField('endereco');
const { value: numero }             = useField('numero');
const { value: cep }                = useField('cep');
const { value: bairro }             = useField('bairro');
const { value: telefone }           = useField('telefone');
const { value: cidade }             = useField('cidade');
const { value: estado }             = useField('estado');

const headers = [
  { title: 'Nome',     align: 'start',  key: 'nome',     sortable: true  },
  { title: 'Telefone', align: 'center', key: 'telefone', sortable: false },
  { title: 'Cidade',   align: 'center', key: 'cidade',   sortable: true  },
  { title: 'Ações',    align: 'end',    key: 'actions',  sortable: false },
];

onMounted(() => fornecedorStore.fetchFornecedores());

const abrirModal = (tipo, item = null) => {
  modo.value = tipo;
  errorMessage.value = null;
  handleReset();
  if (item) {
    selectedId.value = item.id;
    setValues({ nome: item.nome, cpf_cnpj: item.cpf_cnpj, inscricao_estadual: item.inscricao_estadual,
      razao_social: item.razao_social, endereco: item.endereco, numero: item.numero,
      cep: item.cep, bairro: item.bairro, telefone: item.telefone, cidade: item.cidade, estado: item.estado });
  } else {
    selectedId.value = null;
  }
  isDialogOpen.value = true;
};

const abrirExcluir = (item) => {
  selectedId.value = item.id;
  selectNome.value = item.nome;
  isDialogExcluir.value = true;
};

const confirmarExclusao = async () => {
  try {
    await fornecedorStore.removeFornecedor(selectedId.value);
    isDialogExcluir.value = false;
    selectedId.value = null;
  } catch { errorMessage.value = 'Erro ao excluir fornecedor.'; }
};

const submit = handleSubmit(async (values) => {
  try {
    if (modo.value === 'adicao') await fornecedorStore.addFornecedor(values);
    else                         await fornecedorStore.updateFornecedor(selectedId.value, values);
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
  color: rgb(var(--v-theme-warning));
  margin-bottom: 10px;
  margin-top: 4px;
}
</style>
