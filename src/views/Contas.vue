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
            <v-card style="height: 570px;">
              <div v-if="modo === 'pagamento'">
              <v-card-title class="pa-4 bg-success">
                    <span class="title text-white">
                        Pagar Conta
                       </span></v-card-title>
              </div>
              <div v-else-if="modo === 'visualizar'">
                <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white"> Visualizar Conta </span></v-card-title>
              </div>
              <div v-else>
                <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">{{
                        modo === 'adicao' ? 'Adicionar Conta' : 'Editar Conta'
                      }} </span></v-card-title>
              </div>

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
                      <div v-if="modo === 'pagamento' || modo === 'visualizar'">
                        <v-select
                          v-model="fornecedor_id"
                          label="Fornecedor"
                          readonly
                          :items="fornecedor"
                          item-title="nome"
                          item-value="id"
                        />
                      </div>
                      <div v-else>
                      <v-select
                        v-model="fornecedor_id"
                        label="Fornecedor"
                        :items="fornecedor"
                        item-title="nome"
                        item-value="id"
                        :hide-details="!errors.fornecedor_id"
                        :error-messages="errors.fornecedor_id"
                      />
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'pagamento' || modo === 'visualizar'">
                      <v-text-field
                        v-model="numero_documento"
                        label="Numero do Documento"
                        readonly
                      />
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="numero_documento"
                          label="Numero do Documento"
                        />
                        </div>
                    </v-col>
                    <v-col cols="6">
                      <div v-if="modo === 'pagamento' || modo === 'visualizar'">
                        <v-text-field
                          v-model="nota_fiscal"
                          label="Nota Fiscal"
                          readonly
                        />
                        </div>
                      <div v-else>
                        <v-text-field
                          v-model="nota_fiscal"
                          label="Nota Fiscal"
                          :hide-details="!errors.nota_fiscal"
                          :error-messages="errors.nota_fiscal"/>
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <div v-if="modo === 'pagamento' || modo === 'visualizar'">
                        <v-text-field
                          v-model="valor"
                          label="Valor"
                          v-money="moneyOptions"
                          readonly
                          prefix="R$: "
                        />
                       </div>
                      <div v-else>
                        <v-text-field
                          v-model="valor"
                          v-money="moneyOptions"
                          label="Valor"
                          :hide-details="!errors.valor"
                          :error-messages="errors.valor"
                          prefix="R$: "
                           />
                      </div>
                    </v-col>
                    <v-col cols="3">
                      <div v-if="modo === 'adicao' || modo === 'edicao'">
                      <v-text-field
                        v-model="valor_pago"
                        v-money="moneyOptions"
                        disabled
                        label="Valor Pago"
                        prefix="R$: "
                         />
                      </div>
                      <div v-else-if="modo === 'visualizar'">
                        <v-text-field
                          v-model="valor_pago"
                          v-money="moneyOptions"
                          label="Valor Pago"
                          readonly
                          prefix="R$: "
                        />
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="valor_pago"
                          v-money="moneyOptions"
                          label="Valor Pago"
                          :hide-details="!errors.valor_pago"
                          :error-messages="errors.valor_pago"
                          prefix="R$: "
                          />
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'adicao' || modo === 'edicao'">
                      <v-text-field
                        v-model="data_lancamento"
                        type="date"
                        label="Data do Lançamento"
                        disabled />
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="data_lancamento"
                          label="Data do Lançamento"
                          readonly
                          type="date"
                          :hide-details="!errors.data_lancamento"
                          :error-messages="errors.data_lancamento"/>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'pagamento' || modo === 'visualizar'">
                      <v-text-field
                        v-model="data_vencimento"
                        label="Data do Vencimento"
                        readonly
                        type="date" />
                      </div>
                    <div v-else>
                      <v-text-field
                        v-model="data_vencimento"
                        label="Data do Vencimento"
                        type="date"
                        :hide-details="!errors.data_vencimento"
                        :error-messages="errors.data_vencimento" />
                    </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'pagamento'">
                        <v-text-field
                          v-model="data_pagamento"
                          label="Data do Pagamento"
                          type="date"
                          :hide-details="!errors.data_pagamento"
                          :error-messages="errors.data_pagamento" />
                      </div>
                      <div v-else-if="modo === 'visualizar'">
                        <v-text-field
                          v-model="data_pagamento"
                          type="date"
                          readonly
                          label="Data do Pagamento"
                        />
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="data_pagamento"
                          disabled
                          label="Data do Pagamento"
                        />
                      </div>

                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'pagamento' || modo === 'visualizar'">
                      <v-select
                        v-model="tipo_pagamento"
                        label="Tipo de Pagamento"
                        readonly
                        :items="['DINHEIRO', 'CARTÃO', 'PIX']"
                      />
                      </div>
                      <div v-else>
                        <v-select
                          v-model="tipo_pagamento"
                          label="Tipo de Pagamento"
                          :items="['DINHEIRO', 'CARTÃO', 'PIX']"
                          :hide-details="!errors.tipo_pagamento"
                          :error-messages="errors.tipo_pagamento"
                        />
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'pagamento' || modo === 'visualizar'">
                      <v-select
                        v-model="conta_movimento"
                        label="Conta Movimento"
                        readonly
                        :items="['CAIXA', 'CRÉDITO', 'DÉBITO']"
                      />
                      </div>
                      <div v-else>
                      <v-select
                        v-model="conta_movimento"
                        label="Conta Movimento"
                        :items="['CAIXA', 'CRÉDITO', 'DÉBITO']"
                        :hide-details="!errors.conta_movimento"
                        :error-messages="errors.conta_movimento"
                      />
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'pagamento' || modo === 'visualizar'">
                      <v-select
                        v-model="plano_contas"
                        label="Plano de Contas"
                        readonly
                        :items="['Vale Transporte', 'Comida', 'Mecanico']"
                      />
                      </div>
                      <div v-else>
                        <v-select
                          v-model="plano_contas"
                          label="Plano de Contas"
                          :items="['Vale Transporte', 'Comida', 'Mecanico']"
                          :hide-details="!errors.plano_contas"
                          :error-messages="errors.plano_contas"
                        />
                      </div>
                    </v-col>

                  </v-row>

                  <v-row>
                    <v-col class="text-right">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                          <v-btn variant="tonal" flat class="text-error" @click="isDialogOpen = false">Cancelar</v-btn>

                        <div v-if="modo === 'pagamento'">
                        <v-btn type="submit"
                               class="bg-success"
                               flat
                               prepend-icon="mdi-currency-usd"
                               :loading="isSubmitting"
                               :disabled="isSubmitting" variant="tonal">Pagar
                        </v-btn>
                        </div>
                        <div v-else-if="modo === 'adicao' || modo === 'edicao'">
                          <v-btn type="submit"
                                 class="bg-secondary"
                                 flat
                                 :loading="isSubmitting"
                                 :disabled="isSubmitting" variant="tonal">Salvar
                          </v-btn>
                        </div>

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
          :loading="loading"
          loading-text="Carregando dados..."
          :search="search"
          class="elevation-1"
          @reset="handleReset"
        >

          <template v-slot:item.data_lancamento="{ item: conta }">
            {{ formataData(conta.data_lancamento) }}
          </template>
          <template v-slot:item.data_vencimento="{ item: conta }">
            {{ formataData(conta.data_vencimento) }}
          </template>
          <template v-slot:item.status="{ value }">
            <v-chip :color="getColor(value)" >
              {{ value == 1 ? 'ABERTO' : value == 2 ? 'ATRASO' : value == 3 ? 'PAGO' :  value }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item: conta }">
            <div class="align-center">
              <v-btn flat rounded @click="visualizarContas(conta)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil text-primary"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                </svg>
              </v-btn>
              <v-btn flat rounded @click="editarContas(conta)" v-if="conta.status != '3'" >
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil text-secondary"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                </svg>
              </v-btn>
              <v-btn flat rounded @click="abrirExcluir(conta)">
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
              <v-btn flat rounded @click="pagarContas(conta)" v-if="conta.status != '3'">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-coin-filled text-success"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                  <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"></path>
                  <path d="M12 7v10"></path>
                </svg>
              </v-btn>
            </div>
          </template>

        </v-data-table>

        <v-dialog
          v-model="isDialogExcluir"
          width="400px"
        >
          <v-card style="height: 227px;">
            <v-card-title class="pa-3 bg-primary">Excluir Conta</v-card-title>

            <v-card-text>
              <v-row>
                <v-col>
                  Deseja realmente excluir esta conta <b>"{{ selectNome }}"</b>?
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat class="bg-error" @click="isDialogExcluir = false">Não</v-btn>
                    <v-btn @click.stop.prevent="excluirConta(conta)"
                           class="bg-success"
                           flat
                           :loading="isSubmitting"
                           :disabled="isSubmitting" variant="tonal">Sim
                    </v-btn>
                  </v-card-actions>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>

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
const isDialogExcluir = ref(false);
const errorMessage = ref(null);
const isDialogOpen = ref(false);
const modo = ref('adicao');
const loading = ref(true);

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

const headers = ref([
  {title: "Nome do Fornecedor", align: 'start', key: "fornecedor_nome"},
  {title: "Data do Lançamento", align: 'center', key: "data_lancamento"},
  {title: "Data do Vencimento", align: 'center', key: "data_vencimento"},
  {title: "Status", align: 'center', key: "status"},
  {title: "Ações", align: 'center', value: "actions"}
]);

const moneyOptions = ref({
  suffix: '',
  precision: 2,
  decimal: '.',
  thousands: '',
  allowBlank: false,
  masked: true,
});

const search = ref('');
const contas = ref([]);
const fornecedor = ref([]);
const selectNome = ref('');

onMounted(async () => {
  try {
    const responseContas = await authStore.listaContas();
    const responsefornecedores = await authStore.listaFornecedor();
    contas.value = responseContas.data.data;
    fornecedor.value = responsefornecedores.data.data;
    loading.value = false;
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
  } else if (modo.value === 'edicao') {
    return authStore.editarConta(selectedId.value, value).then(() => {
      isDialogOpen.value = false
      router.go();
    }).catch((e) => {
      errorMessage.value = messages[e.response.data.error]
    })
  } else {
      return authStore.pagarContas(selectedId.value, value). then(() => {
        isDialogOpen.value = false
        router.go();
      }). catch((e) => {
        errorMessage.value = messages[e.response.data.error]
      });
  }
})

function abrirExcluir(user) {
  isDialogExcluir.value = true
  selectNome.value = user.fornecedor_nome
  selectedId.value = user.id
}

function excluirConta() {
  authStore.excluirConta(selectedId.value).then(() => {
    isDialogExcluir.value = false
    router.go();
  });
}

function pagarContas(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'pagamento';
  errorMessage.value = null;

  if(modo.value === 'pagamento' ) {
    fornecedor_id.value = user.fornecedor_id
    numero_documento.value = user.numero_documento,
      nota_fiscal.value = user.nota_fiscal,
      valor.value = user.valor,
      valor_pago.value = user.valor_pago,
      data_lancamento.value = user.data_lancamento,
      data_vencimento.value = user.data_vencimento,
      data_pagamento.value = user.data_pagamento,
      tipo_pagamento.value = user.tipo_pagamento,
      conta_movimento.value = user.conta_movimento,
      plano_contas.value = user.plano_contas
  }

}

function editarContas(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'edicao';
  errorMessage.value = null;

  if(modo.value === 'edicao' ) {
    fornecedor_id.value = user.fornecedor_id
    numero_documento.value = user.numero_documento,
      nota_fiscal.value = user.nota_fiscal,
      valor.value = user.valor,
      valor_pago.value = user.valor_pago,
      data_lancamento.value = user.data_lancamento,
      data_vencimento.value = user.data_vencimento,
      data_pagamento.value = user.data_pagamento,
      tipo_pagamento.value = user.tipo_pagamento,
      conta_movimento.value = user.conta_movimento,
      plano_contas.value = user.plano_contas
  }
}

function visualizarContas(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'visualizar';
  errorMessage.value = null;

  if(modo.value === 'visualizar' ) {
    fornecedor_id.value = user.fornecedor_id
    numero_documento.value = user.numero_documento,
      nota_fiscal.value = user.nota_fiscal,
      valor.value = user.valor,
      valor_pago.value = user.valor_pago,
      data_lancamento.value = user.data_lancamento,
      data_vencimento.value = user.data_vencimento,
      data_pagamento.value = user.data_pagamento,
      tipo_pagamento.value = user.tipo_pagamento,
      conta_movimento.value = user.conta_movimento,
      plano_contas.value = user.plano_contas
  }
}

function abrirModal() {
  errorMessage.value = null;
  isDialogOpen.value = true
  selectedId.value = '';
  modo.value = 'adicao'
  handleReset()
}

const getColor = (status) => {
  if (status == 1) return 'primary'
  else if (status == 3) return 'success'
  else return 'warning';
}

const formataData = ref((value) => {
  if (value) {
    const date = new Date(value);

    date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    const dateFormatted = date.toLocaleDateString('pt-BR');

    return dateFormatted;
  }
  return '';
});

const itemsPerPage = ref(10);

</script>






