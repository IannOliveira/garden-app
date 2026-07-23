<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Clientes</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ clientes.length }} cliente{{ clientes.length !== 1 ? 's' : '' }} cadastrado{{ clientes.length !== 1 ? 's' : '' }}
        </p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        rounded="lg"
        @click="abrirModal('adicao')"
      >
        Novo Cliente
      </v-btn>
    </div>

    <!-- Data Card -->
    <v-card variant="flat" border rounded="xl">
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="clientes"
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
              placeholder="Pesquisar clientes..."
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
            <v-avatar color="primary" rounded="md" size="34" class="mr-3">
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

        <!-- Empty state -->
        <template v-slot:no-data>
          <div class="pa-12 text-center">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-account-off-outline</v-icon>
            <p class="text-body-2 text-medium-emphasis">Nenhum cliente encontrado.</p>
            <v-btn color="primary" variant="tonal" class="mt-3" prepend-icon="mdi-plus" @click="abrirModal('adicao')">
              Adicionar primeiro cliente
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ── Add/Edit/View Dialog ── -->
    <EntityDialog
      v-model="isDialogOpen"
      :mode="modo"
      width="960px"
      :title="modo === 'adicao' ? 'Novo Cliente' : modo === 'edicao' ? 'Editar Cliente' : 'Detalhes do Cliente'"
    >
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        rounded="lg"
        class="mb-4"
        closable
        @click:close="errorMessage = null"
      >
        {{ errorMessage }}
      </v-alert>

      <form @submit.prevent="submit">
        <!-- Section: Dados Pessoais -->
        <p class="section-label">Dados Pessoais</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="4">
            <BaseField v-model="nome" label="Nome Completo" :errors="errors.nome" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="4">
            <BaseField v-model="cpf" label="CPF" :errors="errors.cpf" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="rg"
              label="RG"
              :error-messages="errors.rg"
              :readonly="modo === 'visualizar'"
              v-mask="'#######'"
              variant="outlined"
              density="compact"
              rounded="lg"
              color="primary"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="sexo"
              label="Sexo"
              :items="['Masculino', 'Feminino']"
              :readonly="modo === 'visualizar'"
              variant="outlined"
              density="compact"
              rounded="lg"
              color="primary"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="estado_civil"
              label="Estado Civil"
              :items="['Solteiro', 'Casado', 'Viúvo']"
              :readonly="modo === 'visualizar'"
              variant="outlined"
              density="compact"
              rounded="lg"
              color="primary"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="telefone"
              label="Celular"
              v-mask="'(##)#####-####'"
              :error-messages="errors.telefone"
              :readonly="modo === 'visualizar'"
              variant="outlined"
              density="compact"
              rounded="lg"
              color="primary"
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <!-- Section: Endereço -->
        <p class="section-label">Endereço</p>
        <v-row dense class="mb-3">
          <v-col cols="12" md="6">
            <BaseField v-model="endereco" label="Endereço" :errors="errors.endereco" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="6" md="2">
            <BaseField v-model="numero_casa" label="Nº" :errors="errors.numero_casa" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="6" md="4">
            <BaseField v-model="bairro" label="Bairro" :errors="errors.bairro" :readonly="modo === 'visualizar'" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="cep"
              label="CEP"
              v-mask="'#####-###'"
              :readonly="modo === 'visualizar'"
              variant="outlined"
              density="compact"
              rounded="lg"
              color="primary"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="cidade"
              label="Cidade"
              :items="['Abaetetuba', 'Belém', 'Macapá']"
              :error-messages="errors.cidade"
              :readonly="modo === 'visualizar'"
              variant="outlined"
              density="compact"
              rounded="lg"
              color="primary"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="estado"
              label="Estado"
              :items="['PA', 'AP', 'TO']"
              :error-messages="errors.estado"
              :readonly="modo === 'visualizar'"
              variant="outlined"
              density="compact"
              rounded="lg"
              color="primary"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="pais"
              label="País"
              :items="['Brasil', 'Angola', 'EUA']"
              :error-messages="errors.pais"
              :readonly="modo === 'visualizar'"
              variant="outlined"
              density="compact"
              rounded="lg"
              color="primary"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="5">
            <BaseField v-model="referencia" label="Referência" :readonly="modo === 'visualizar'" />
          </v-col>
        </v-row>

        <!-- Section: Contato Digital -->
        <p class="section-label">Contato Digital</p>
        <v-row dense>
          <v-col cols="12" md="6">
            <BaseField v-model="rede_social" label="Rede Social (Instagram / Facebook / E-mail)" :readonly="modo === 'visualizar'" />
          </v-col>
        </v-row>

        <!-- Actions -->
        <div class="d-flex justify-end ga-2 mt-6">
          <v-btn variant="text" color="grey-darken-1" rounded="lg" @click="isDialogOpen = false">
            {{ modo === 'visualizar' ? 'Fechar' : 'Cancelar' }}
          </v-btn>
          <v-btn
            v-if="modo !== 'visualizar'"
            type="submit"
            color="primary"
            variant="flat"
            rounded="lg"
            :loading="loading"
            prepend-icon="mdi-content-save-outline"
          >
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
            <p class="text-subtitle-1 font-weight-bold mb-0">Excluir Cliente</p>
            <p class="text-body-2 text-medium-emphasis mb-0">Esta ação não pode ser desfeita</p>
          </div>
        </div>
        <v-divider />
        <v-card-text class="pa-5">
          Deseja realmente excluir o cliente <strong>{{ selectNome }}</strong>?
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
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useClienteStore } from '@/store/clienteStore';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import messages from '@/utils/messages';
import EntityDialog from '@/components/common/EntityDialog.vue';
import BaseField from '@/components/common/BaseField.vue';

const clienteStore = useClienteStore();
const { clientes, loading } = storeToRefs(clienteStore);

const isDialogExcluir = ref(false);
const isDialogOpen    = ref(false);
const errorMessage    = ref(null);
const modo            = ref('adicao');
const search          = ref('');
const selectedId      = ref('');
const selectNome      = ref('');
const itemsPerPage    = ref(10);

const schema = yup.object({
  nome:        yup.string().required('Nome é obrigatório.'),
  cpf:         yup.string().required('CPF é obrigatório.'),
  rg:          yup.string().required('RG é obrigatório.'),
  endereco:    yup.string().required('Endereço é obrigatório.'),
  numero_casa: yup.string().required('Número é obrigatório.'),
  bairro:      yup.string().required('Bairro é obrigatório.'),
  pais:        yup.string().required('País é obrigatório.'),
  estado:      yup.string().required('Estado é obrigatório.'),
  cidade:      yup.string().required('Cidade é obrigatória.'),
  telefone:    yup.string().required('Celular é obrigatório.'),
});

const { handleSubmit, errors, handleReset, setValues } = useForm({
  validationSchema: schema,
  initialValues: { pais: 'Brasil', estado: 'PA', sexo: 'Masculino', estado_civil: 'Solteiro' },
});

const { value: nome }         = useField('nome');
const { value: cpf }          = useField('cpf');
const { value: rg }           = useField('rg');
const { value: endereco }     = useField('endereco');
const { value: numero_casa }  = useField('numero_casa');
const { value: bairro }       = useField('bairro');
const { value: cep }          = useField('cep');
const { value: referencia }   = useField('referencia');
const { value: pais }         = useField('pais');
const { value: estado }       = useField('estado');
const { value: cidade }       = useField('cidade');
const { value: rede_social }  = useField('rede_social');
const { value: telefone }     = useField('telefone');
const { value: sexo }         = useField('sexo');
const { value: estado_civil } = useField('estado_civil');

const headers = [
  { title: 'Nome',     align: 'start',  key: 'nome',     sortable: true  },
  { title: 'Telefone', align: 'center', key: 'telefone', sortable: false },
  { title: 'Cidade',   align: 'center', key: 'cidade',   sortable: true  },
  { title: 'Ações',    align: 'end',    key: 'actions',  sortable: false },
];

onMounted(() => clienteStore.fetchClientes().catch(console.error));

const abrirModal = (m = 'adicao', client = null) => {
  modo.value = m;
  errorMessage.value = null;
  handleReset();
  if (client) {
    selectedId.value = client.id;
    selectNome.value = client.nome;
    setValues({ ...client });
  } else {
    selectedId.value = '';
  }
  isDialogOpen.value = true;
};

const abrirExcluir = (client) => {
  selectedId.value   = client.id;
  selectNome.value   = client.nome;
  isDialogExcluir.value = true;
};

const confirmarExclusao = async () => {
  try {
    await clienteStore.excluirCliente(selectedId.value);
    isDialogExcluir.value = false;
  } catch {
    errorMessage.value = 'Falha ao excluir cliente.';
  }
};

const submit = handleSubmit(async (values) => {
  errorMessage.value = null;
  try {
    if (modo.value === 'adicao') await clienteStore.cadastrarCliente(values);
    else                         await clienteStore.editarCliente(selectedId.value, values);
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
  color: rgb(var(--v-theme-primary));
  margin-bottom: 10px;
  margin-top: 4px;
}
</style>
