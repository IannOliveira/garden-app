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
            <v-card-title class="text-h5">Fornecedores Cadastrados</v-card-title>
          </div>

          <v-divider aria-orientation="horizontal" role="separator"/>

          <v-dialog
            v-model="isDialogOpen"
            width="1000px"
          >
            <v-card style="height: 480px;">
              <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">{{
                        modo === 'adicao' ? 'Adicionar Fornecedor' : 'Editar Fornecedor'
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

                  <v-col cols="4">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-text-field
                      v-model="nome"
                      label="Nome"
                      :hide-details="!errors.nome"
                      :error-messages="errors.nome">
                    </v-text-field>
                    </div>
                    <div v-else>
                      <v-text-field
                        v-model="nome"
                        label="Nome"
                        readonly
                        :hide-details="!errors.nome">
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-text-field
                      v-model="cpf_cnpj"
                      label="CPF/CNPJ"
                      :hide-details="!errors.cpf_cnpj">
                    </v-text-field>
                    </div>
                    <div v-else>
                      <v-text-field
                        v-model="cpf_cnpj"
                        label="CPF/CNPJ"
                        readonly
                        :hide-details="!errors.cpf_cnpj">
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                      <v-text-field
                        v-model="inscricao_estadual"
                        label="Inscrição Estadual"
                        :hide-details="!errors.inscricao_estadual">
                      </v-text-field>
                    </div>
                    <div v-else>
                      <v-text-field
                        v-model="inscricao_estadual"
                        label="Inscrição Estadual"
                        readonly
                        :hide-details="!errors.inscricao_estadual">
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="5">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-text-field
                      v-model="razao_social"
                      label="Razão Social"
                      :hide-details="!errors.razao_social">
                    </v-text-field>
                    </div>
                    <div v-else>
                      <v-text-field
                        v-model="razao_social"
                        readonly
                        label="Razão Social"
                        :hide-details="!errors.razao_social">
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="5">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-text-field
                      v-model="endereco"
                      label="Endereço"
                      :hide-details="!errors.endereco"
                      :error-messages="errors.endereco">
                    </v-text-field>
                    </div>
                    <div v-else>
                      <v-text-field
                        v-model="endereco"
                        label="Endereço"
                        readonly
                        :hide-details="!errors.endereco">
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="2">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-text-field
                      v-model="numero"
                      label="N°"
                      :hide-details="!errors.numero">
                    </v-text-field>
                    </div>
                    <div v-else>
                    <v-text-field
                      v-model="numero"
                      label="N°"
                      readonly
                      :hide-details="!errors.numero">
                    </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-text-field
                      v-model="cep"
                      label="CEP"
                      v-mask="'#####-###'"
                      :hide-details="!errors.cep">
                    </v-text-field>
                    </div>
                    <div v-else>
                      <v-text-field
                        v-model="cep"
                        label="CEP"
                        readonly
                        v-mask="'#####-###'"
                        :hide-details="!errors.cep">
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-select
                      v-model="cidade"
                      label="Cidade"
                      :items="['Belém', 'Abaetetuba', 'Ananindeua']"
                      :hide-details="!errors.cidade"
                      :error-messages="errors.cidade"
                    />
                    </div>
                    <div v-else>
                      <v-select
                        v-model="cidade"
                        label="Cidade"
                        readonly
                        :hide-details="!errors.cidade"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-select
                      v-model="estado"
                      label="Estado"
                      :items="['PA', 'AP', 'TO']"
                      :hide-details="!errors.estado"
                      :error-messages="errors.estado"
                    />
                    </div>
                    <div v-else>
                      <v-select
                        v-model="estado"
                        label="Estado"
                        readonly
                        :hide-details="!errors.estado"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-text-field
                      v-model="bairro"
                      label="Bairro"
                      :hide-details="!errors.bairro"
                      :error-messages="errors.bairro">
                    </v-text-field>
                    </div>
                    <div v-else>
                      <v-text-field
                        v-model="bairro"
                        label="Bairro"
                        readonly
                        :hide-details="!errors.bairro">
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div v-if="modo === 'adicao' || modo === 'edicao'">
                    <v-text-field
                      v-model="telefone"
                      label="Celular"
                      v-mask="'(##)#####-####'"
                      :hide-details="!errors.telefone">
                    </v-text-field>
                      </div>
                        <div v-else>
                          <v-text-field
                            v-model="telefone"
                            label="Celular"
                            v-mask="'(##)#####-####'"
                            readonly
                            :hide-details="!errors.telefone">
                          </v-text-field>
                        </div>

                  </v-col>
                </v-row>

                <v-row>
                  <v-col class="text-right">
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn variant="tonal" flat class="text-error" @click="isDialogOpen = false">Cancelar</v-btn>
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
            hide-details
            density="compact"
            variant="solo"
          />
        </div>

        <VDataTable
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="fornecedores"
          :search="search"
          :sort-by="[{key: 'nome', order: 'asc'}]"
          class="elevation-1 text-subtitle-1 font-weight-semibold"
          @reset="handleReset"
        >

          <template v-slot:item.actions="{ item: fornecedor }">
            <div class="align-center">
              <v-btn flat rounded @click="visualizarFornecedor(fornecedor)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil text-primary"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                </svg>
              </v-btn>
              <v-btn flat rounded @click="editarFornecedor(fornecedor)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil text-secondary"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                </svg>
              </v-btn>
            </div>
          </template>

        </VDataTable>

      </v-card>
    </div>
  </v-row>
</template>

<script setup>
import router from "@/router";
import messages from "@/utils/messages";
import {onMounted, ref} from "vue";
import {useAuth} from "@/store/auth";
import {useField, useForm} from "vee-validate";
import * as yup from "yup";


const authStore = useAuth();
const errorMessage = ref(null);
const isDialogOpen = ref(false);
const modo = ref('adicao');

const schema = yup.object({
  nome: yup.string().required('Nome é um campo obrigatório.'),
  endereco: yup.string().required('Endereco é um campo obrigatório.'),
  estado: yup.string().required('Estado é um campo obrigatório.'),
  cidade: yup.string().required('Cidade é um campo obrigatório.'),
  bairro: yup.string().required('Bairro é um campo obrigatório.'),
});

const {handleSubmit, errors, isSubmitting, handleReset} = useForm({
  validationSchema: schema
});

const selectedId = ref('');

const {value: cpf_cnpj} = useField('cpf_cnpj');
const {value: inscricao_estadual} = useField('inscricao_estadual');
const {value: nome} = useField('nome');
const {value: razao_social} = useField('razao_social');
const {value: endereco} = useField('endereco');
const {value: numero} = useField('numero');
const {value: cep} = useField('cep');
const {value: estado} = useField('estado');
const {value: cidade} = useField('cidade');
const {value: bairro} = useField('bairro');
const {value: telefone} = useField('telefone');

const headers = ref([
  {title: "Nome", align: 'start', key: "nome"},
  {title: "Telefone", align: 'center', key: "telefone"},
  {title: "Ações", align: 'center', value: "actions"},
]);

const search = ref('');


const submit = handleSubmit((value) => {
  console.log('aqui')
  errorMessage.value = null
  if ((selectedId.value == null || selectedId.value == '') && modo.value === 'adicao') {
    return authStore.cadastrarFornecedor(value)
      .then(() => {
        isDialogOpen.value = false
        router.go();
      }).catch((e) => {
        errorMessage.value = messages[e.response.data.error]
      });
  } else {
    return authStore.editarFornecedor(selectedId.value, value).then(() => {
      isDialogOpen.value = false
      router.go();
    }).catch((e) => {
      errorMessage.value = messages[e.response.data.error]
    })
  }
})

function visualizarFornecedor(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'visualizar';
  errorMessage.value = null

  if (modo.value === 'visualizar') {
    nome.value = user.nome,
      cpf_cnpj.value = user.cpf_cnpj,
      inscricao_estadual.value = user.inscricao_estadual,
      razao_social.value = user.razao_social,
      endereco.value = user.endereco,
      numero.value = user.numero,
      cep.value = user.cep,
      cidade.value = user.cidade,
      estado.value = user.estado,
      bairro.value = user.bairro,
      telefone.value = user.telefone
  }
}

function editarFornecedor(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'edicao';
  errorMessage.value = null

  if (modo.value === 'edicao') {
    nome.value = user.nome,
      cpf_cnpj.value = user.cpf_cnpj,
      inscricao_estadual.value = user.inscricao_estadual,
      razao_social.value = user.razao_social,
      endereco.value = user.endereco,
      numero.value = user.numero,
      cep.value = user.cep,
      cidade.value = user.cidade,
      estado.value = user.estado,
      bairro.value = user.bairro,
      telefone.value = user.telefone
  }
}

const fornecedores = ref([]);

onMounted(async () => {
  try {
    const response = await authStore.listaFornecedor();
    fornecedores.value = response.data.data;
  } catch (error) {
    console.error('Erro ao buscar a lista de clientes:', error);
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
