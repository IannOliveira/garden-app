<template>
  <v-row>
    <v-app-bar elevation="0" height="50" color="#455a64">
      <v-btn @click="abrirModal('adicao')" aria-haspopup="dialog"
             aria-expanded="false" class="ml-auto">
        <v-icon class="mdi-account-multiple-plus mdi v-icon--size-default mr-2 text-left" aria-hidden="true"/>
      </v-btn>
    </v-app-bar>


    <div class="v-col-md-12 v-col-12">
      <v-card class="border mb-4">
        <v-card-item class="py-4 px-6">

          <div class="d-sm-flex align-center justify-space-between">
            <v-card-title class="text-h5">Contas Cadastrados</v-card-title>
          </div>

          <v-divider aria-orientation="horizontal" role="separator"/>

          <v-dialog
            v-model="isDialogOpen"
            width="1000px"
          >
            <v-card style="height: 525px;">
              <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">{{
                        modo === 'adicao' ? 'Adicionar Conta' : 'Editar Conta'
                      }} </span></v-card-title>

              <v-card-text>

                <v-alert
                  v-if="errorMessage"
                  type="error"
                  :text="errorMessage"
                  :icon="false"
                  class="mb-5"
                />

                <form @submit="submit" @reset="handleReset">
                  <v-row>
                    <v-col cols="8">
                      <v-select
                        v-model="fornecedor_id"
                        label="Fornecedor"
                        :items="fornecedor"
                        item-title="nome"
                        item-value="id"
                        :hide-details="!errors.fornecedor_id"
                        :error-messages="errors.fornecedor_id"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="numero_documento"
                        label="Numero do Documento"
                        :hide-details="!errors.numero_documento"
                        :error-messages="errors.numero_documento">
                      </v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="nota_fiscal"
                        label="Nota Fiscal"
                        :hide-details="!errors.nota_fiscal"
                        :error-messages="errors.nota_fiscal">
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="valor"
                        label="Valor"
                        :hide-details="!errors.valor"
                        :error-messages="errors.valor"
                        prefix="R$: ">

                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <div v-if="modo === 'adicao'">
                      <v-text-field
                        v-model="valor_pago"
                        label="Valor Pago"
                        disabled>
                      </v-text-field>
                      </div>
                      <div v-else-if="modo === 'pagamento'">
                        <v-text-field
                          v-model="valor_pago"
                          label="Valor Pago"
                          :hide-details="!errors.valor_pago"
                          :error-messages="errors.valor_pago"
                          prefix="R$: ">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'adicao'">
                      <v-text-field
                        v-model="data_lancamento"
                        label="Data do Lançamento"
                        disabled
                        type="date">
                      </v-text-field>
                      </div>
                      <div v-else-if="modo === 'pagamento'">
                        <v-text-field
                          v-model="data_lancamento"
                          label="Data do Lançamento"
                          type="date"
                          :hide-details="!errors.data_lancamento"
                          :error-messages="errors.data_lancamento">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="data_vencimento"
                        label="Data do Vencimento"
                        type="date"
                        :hide-details="!errors.data_vencimento"
                        :error-messages="errors.data_vencimento">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'adicao'">
                      <v-text-field
                        v-model="data_pagamento"
                        label="Data do Pagamento"
                        type="date"
                        disabled>
                      </v-text-field>
                      </div>
                      <div v-else-if="modo === 'pagamento'">
                        <v-text-field
                          v-model="data_pagamento"
                          label="Data do Pagamento"
                          type="date"
                          :hide-details="!errors.data_pagamento"
                          :error-messages="errors.data_pagamento">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        v-model="tipo_pagamento"
                        label="Tipo de Pagamento"
                        :items="['DINHEIRO', 'CARTÃO', 'PIX']"
                        :hide-details="!errors.tipo_pagamento"
                        :error-messages="errors.tipo_pagamento"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        v-model="conta_movimento"
                        label="Conta Movimento"
                        :items="['CAIXA', 'CRÉDITO', 'DÉBITO']"
                        :hide-details="!errors.conta_movimento"
                        :error-messages="errors.conta_movimento"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-select
                        v-model="plano_contas"
                        label="Plano de Contas"
                        :items="['Vale Transporte', 'Comida', 'Mecanico']"
                        :hide-details="!errors.plano_contas"
                        :error-messages="errors.plano_contas"
                      />
                    </v-col>

                  </v-row>

                  <v-row>
                    <v-col class="text-right">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat class="text-error" @click="isDialogOpen = false">Cancelar</v-btn>
                        <v-btn type="submit"
                               class="bg-secondary"
                               flat
                               :loading="isSubmitting"
                               :disabled="isSubmitting" variant="tonal">Salvar
                        </v-btn>
                      </v-card-actions>
                    </v-col>

                  </v-row>
                </form>

              </v-card-text>
            </v-card>

          </v-dialog>


        </v-card-item>

        <div class="v-col-md-3 v-col-12">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Procurar"
            hide-details
            density="compact"
            variant="solo"
          />
        </div>

        <v-data-table
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="contas"
          :search="search"
          :sort-by="[{key: 'nome', order: 'asc'}]"
          class="elevation-1"
          @reset="handleReset"
        >

          <template v-slot:item.actions="{ item: cliente }">
            <div class="align-center">
              <v-btn flat rounded>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil text-primary"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                </svg>
              </v-btn>
              <v-btn flat rounded >
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash text-error"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7"></line>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                </svg>
              </v-btn>
            </div>
          </template>

        </v-data-table>

      </v-card>

    </div>
  </v-row>

</template>

<script setup>

import {onMounted, ref} from 'vue';
import * as yup from "yup";
import {useField, useForm} from "vee-validate";
import {useAuth} from "@/store/auth";
import router from "@/router";
import messages from "@/utils/messages";

const authStore = useAuth();
const errorMessage = ref(null);
const isDialogOpen = ref(false);
const modo = ref('adicao');

const schema = yup.object({
  fornecedor_id: yup.string().required('Fornecedor é um campo obrigatório.'),
  valor: yup.string().required('Valor é um campo obrigatório.'),
  data_vencimento: yup.string().required('Data do vencimento é um campo obrigatório.'),
  conta_movimento: yup.string().required('Conta movimento é um campo obrigatório.'),
  tipo_pagamento: yup.string().required('Tipo do pagamento é um campo obrigatório.'),
  plano_contas: yup.string().required('Plano de contas é um campo obrigatório.'),
});

const selectedId = ref('');

const {handleSubmit, errors, isSubmitting, handleReset} = useForm({
  validationSchema: schema
});

const {value: fornecedor_id} = useField('fornecedor_id');
const {value: numero_documento} = useField('numero_documento');
const {value: nota_fiscal} = useField('nota_fiscal');
const {value: valor} = useField('valor');
const {value: valor_pago} = useField('valor_pago');
const {value: data_lancamento} = useField('data_lancamento');
const {value: data_vencimento} = useField('data_vencimento');
const {value: data_pagamento} = useField('data_pagamento');
const {value: tipo_pagamento} = useField('tipo_pagamento');
const {value: conta_movimento} = useField('conta_movimento');
const {value: plano_contas} = useField('plano_contas');
const {value: status} = useField('status');

const headers = ref([
  {title: "Nome", align: 'start', key: "fornecedor_nome"},
  {title: "Telefone", align: 'center', key: "valor"},
  {title: "Ações", align: 'center', value: "actions"},
]);

const search = ref('');

const contas = ref([]);
const fornecedor = ref([]);

onMounted(async () => {
  try {
    const responseContas = await authStore.listaContas();
    const responsefornecedores = await authStore.listaFornecedor();
    contas.value = responseContas.data.data;
    fornecedor.value = responsefornecedores.data.data;
} catch (error) {
    console.error('Erro ao buscar a lista de clientes:', error);
  }
})

const submit = handleSubmit((value) => {
  errorMessage.value = null
  if ((selectedId.value == null || selectedId.value == '') && modo.value === 'adicao') {
    return authStore.cadastrarContas(value)
      .then(() => {
        isDialogOpen.value = false
        router.go();
      }).catch((e) => {
        errorMessage.value = messages[e.response.data.error]
      });
  } else {
    return authStore.editarCliente(selectedId.value, value).then(() => {
      isDialogOpen.value = false
      router.go();
    }).catch((e) => {
      errorMessage.value = messages[e.response.data.error]
    })
  }
})

function abrirModal() {
  isDialogOpen.value = true
  selectedId.value = '';
  modo.value = 'adicao'
  handleReset()
}

const itemsPerPage = ref(10);

</script>






