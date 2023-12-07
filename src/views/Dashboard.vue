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
            <v-card-title class="text-h5">Produtos</v-card-title>
          </div>

          <v-divider aria-orientation="horizontal" role="separator"/>

          <v-dialog
            v-model="isDialogOpen"
            width="1000px"
          >
            <v-card style="height: 480px;">
              <div v-if="modo === 'visualizar'">
                <v-card-title class="pa-4 bg-primary">
                  <span class="title text-white"> Visualizar Produto </span></v-card-title>
              </div>
              <div v-else>
                <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">{{
                        modo === 'adicao' ? 'Adicionar Produto' : 'Editar Produto'
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
                    <v-col cols="12">
                      <div v-if="modo === 'adicao' || modo === 'edicao'">
                        <v-text-field
                          v-model="nome_produto"
                          label="Nome do Produto"
                          :hide-details="!errors.nome_produto"
                          :error-messages="errors.nome_produto">
                        </v-text-field>
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="nome_produto"
                          label="Nome do Produto"
                          readonly
                          :hide-details="!errors.nome_produto">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div v-if="modo === 'adicao' || modo === 'edicao'">
                        <v-text-field
                          v-model="descricao"
                          label="Descricao"
                          :hide-details="!errors.descricao"
                          :error-messages="errors.descricao">
                        </v-text-field>
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="descricao"
                          label="Descricao"
                          readonly
                          :hide-details="!errors.descricao">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div v-if="modo === 'adicao' || modo === 'edicao'">
                        <v-select
                          v-model="categoria"
                          label="Categoria"
                          :items="['Profissional', 'Men', 'Manutenção', 'Acessórios']"
                          :hide-details="!errors.categoria"
                          :error-messages="errors.categoria">
                        </v-select>
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="categoria"
                          label="Categoria"
                          readonly
                          :hide-details="!errors.categoria">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="6">
                      <div v-if="modo === 'adicao' || modo === 'edicao'">
                        <v-select
                          v-model="fabricante"
                          label="Fabricante"
                          :items="['GARDEN']"
                          :hide-details="!errors.fabricante"
                          :error-messages="errors.fabricante">
                        </v-select>
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="fabricante"
                          readonly
                          label="Fabricante"
                          :hide-details="!errors.fabricante">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'adicao' || modo === 'edicao'">
                        <v-text-field
                          v-model="preco"
                          label="Preço"
                          v-money="moneyOptions"
                          prefix="R$: "
                          :hide-details="!errors.preco"
                          :error-messages="errors.preco">
                        </v-text-field>
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="preco"
                          label="Preço"
                          v-money="moneyOptions"
                          readonly
                          prefix="R$: "
                          :hide-details="!errors.preco">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <div v-if="modo === 'adicao' || modo === 'edicao'">
                        <v-text-field
                          v-model="preco_venda"
                          label="Preço de Venda"
                          v-money="moneyOptions"
                          prefix="R$: "
                          :hide-details="!errors.preco_venda"
                          :error-messages="errors.preco_venda">
                        </v-text-field>
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="preco_venda"
                          label="Preço de Venda"
                          v-money="moneyOptions"
                          prefix="R$: "
                          readonly
                          :hide-details="!errors.cep">
                        </v-text-field>
                      </div>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="porcentagem"
                        label="Porcentagem"
                        disabled
                        prefix="%"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col class="text-right">
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat variant="tonal" class="text-error" @click="isDialogOpen = false">Cancelar</v-btn>
                        <div v-if="modo === 'adicao' || modo === 'edicao'">
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
            role="textbox"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Procurar"
            clearable
            hide-details
            density="compact"
            variant="solo"
          />
        </div>

        <v-data-table
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="produtos"
          :search="search"
          :loading="loading"
          loading-text="Carregando dados..."
          :sort-by="[{key: 'nome', order: 'asc'}]"
          class="elevation-1 border-b"
          @reset="handleReset"
        >

          <template v-slot:item.actions="{ item: produto }">
            <div class="align-center">
              <v-btn flat rounded @click="visualizarProduto(produto)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil text-primary"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>
                  <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/>
                </svg>
              </v-btn>
              <v-btn flat rounded @click="editarProduto(produto)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil text-secondary"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                </svg>
              </v-btn>
              <v-btn flat rounded @click="abrirExcluir(produto)">
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

import {computed, onMounted, ref} from "vue";
import {useAuth} from "@/store/auth";
import router from "@/router";
import messages from "@/utils/messages";
import * as yup from "yup";
import {useField, useForm} from "vee-validate";

const isDialogOpen = ref(false);
const authStore = useAuth();
const produtos = ref([]);
const itemsPerPage = ref(10);
const search = ref('');
const modo = ref('adicao');
const errorMessage = ref(null);
const selectedId = ref('');
const loading = ref(true);

const headers = ref([
  {title: "Nome", align: 'start', key: "nome_produto"},
  {title: "Telefone", align: 'center', key: "categoria"},
  {title: "Ações", align: 'center', value: "actions"},
]);

onMounted(async () => {
  try {
    const response = await authStore.listaProdutos();
    produtos.value = response.data.data;
    loading.value = false;
  } catch (error) {
    console.error('Erro ao buscar a lista de clientes:', error);
  }
})

const porcentagem = computed(() => {
  if (!isNaN(preco.value) && !isNaN(preco_venda.value) && preco.value !== 0) {
    const diferenca = preco_venda.value - preco.value;
    const porcentagem = (diferenca / preco.value) * 100;
    return !isNaN(porcentagem) ? porcentagem.toFixed(2) : 0;
  }

return 0;
})


function abrirModal() {
  isDialogOpen.value = true
  selectedId.value = '';
  modo.value = 'adicao'
  handleReset()
}

const schema = yup.object({
  nome_produto: yup.string().required('Nome do Produto é um campo obrigatório.'),
  descricao: yup.string().required('Descrição é um campo obrigatório.'),
  categoria: yup.string().required('Categoria é um campo obrigatório.'),
  fabricante: yup.string().required('Fabricante é um campo obrigatório.'),
  preco: yup.string().required('Preço é um campo obrigatório.'),
  preco_venda: yup.string().required('Preço de Venda é um campo obrigatório.'),
});

const {handleSubmit, errors, isSubmitting, handleReset} = useForm({
  validationSchema: schema
});

const {value: nome_produto} = useField('nome_produto');
const {value: descricao} = useField('descricao');
const {value: categoria} = useField('categoria');
const {value: fabricante} = useField('fabricante');
const {value: preco} = useField('preco');
const {value: preco_venda} = useField('preco_venda');


const submit = handleSubmit((value) => {
  errorMessage.value = null;
  if ((selectedId.value == null || selectedId.value == '') && modo.value === 'adicao') {
    return authStore.cadastrarProduto(value)
      .then(() => {
        isDialogOpen.value = false;
        router.go();
      }).catch((e) => {
        errorMessage.value = messages[e.response.data.error]
      });
  } else {
    return authStore.editarProduto(selectedId.value, value).then(() => {
      isDialogOpen.value = false;
      router.go();
    }).catch((e) => {
      errorMessage.value = messages[e.response.data.error]
    })
  }
})

function editarProduto(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'edicao';
  errorMessage.value = null;

  if (modo.value === 'edicao') {
    nome_produto.value = user.nome_produto
    descricao.value = user.descricao,
      categoria.value = user.categoria,
      fabricante.value = user.fabricante,
      preco.value = user.preco,
      preco_venda.value = user.preco_venda
  }
}

function visualizarProduto(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'visualizar';
  errorMessage.value = null;

  if (modo.value === 'visualizar') {
    nome_produto.value = user.nome_produto
    descricao.value = user.descricao,
      categoria.value = user.categoria,
      fabricante.value = user.fabricante,
      preco.value = user.preco,
      preco_venda.value = user.preco_venda
  }
}

const moneyOptions = ref({
  suffix: '',
  precision: 2,
  decimal: '.',
  thousands: '',
  allowBlank: false,
  masked: true,
});


</script>
