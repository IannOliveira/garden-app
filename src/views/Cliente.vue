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
            <v-card-title class="text-h5">Clientes Cadastrados</v-card-title>
          </div>

          <v-divider aria-orientation="horizontal" role="separator"/>

          <v-dialog
            v-model="isDialogOpen"
            width="1000px"
          >
            <v-card style="height: 480px;">
              <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">{{
                        modo === 'adicao' ? 'Adicionar Cliente' : 'Editar Cliente'
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
                      <v-text-field
                        v-model="nome"
                        label="Nome"
                        :hide-details="!errors.nome"
                        :error-messages="errors.nome"
                      >
                      </v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        v-model="cpf"
                        v-mask="'###.###.###-##'"
                        label="CPF"
                        :hide-details="!errors.cpf"
                        :error-messages="errors.cpf">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="rg"
                        v-mask="'#######'"
                        label="RG"
                        :hide-details="!errors.rg"
                        :error-messages="errors.rg">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="endereco"
                        label="Endereço"
                        :hide-details="!errors.endereco"
                        :error-messages="errors.endereco">
                      </v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field
                        v-model="numero_casa"
                        label="N°"
                        :hide-details="!errors.numero_casa"
                        :error-messages="errors.numero_casa">
                      </v-text-field>
                    </v-col>
                    <v-col class="v-col-3">
                      <v-text-field
                        v-model="bairro"
                        label="Bairro"
                        :hide-details="!errors.bairro"
                        :error-messages="errors.bairro">
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="cep"
                        label="CEP"
                        v-mask="'#####-###'"
                        :hide-details="!errors.cep">
                      </v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="referencia"
                        label="Referencia"
                        :hide-details="!errors.referencia">
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-select
                        v-model="pais"
                        label="País"
                        :items="['Brasil', 'Angola', 'EUA']"
                        :hide-details="!errors.pais"
                        :error-messages="errors.pais"
                      />
                    </v-col>
                    <v-col cols="2">
                      <v-select
                        v-model="estado"
                        label="Estado"
                        :items="['PA', 'AP', 'TO']"
                        :hide-details="!errors.estado"
                        :error-messages="errors.estado"
                      />
                    </v-col>
                    <v-col cols="3">
                      <v-select
                        v-model="cidade"
                        label="Cidade"
                        :items="['Abaetetuba', 'Belém', 'Macapá']"
                        :hide-details="!errors.cidade"
                        :error-messages="errors.cidade"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="rede_social"
                        label="Email/Instagram/Facebook"
                        :hide-details="!errors.rede_social">
                      </v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        v-model="telefone"
                        label="Celular"
                        v-mask="'(##)#####-####'"
                        :hide-details="!errors.telefone"
                        :error-messages="errors.telefone">
                      </v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-select
                        v-model="sexo"
                        label="Sexo"
                        :items="['Masculino', 'Feminino']"
                        :hide-details="!errors.sexo"
                      />
                    </v-col>
                    <v-col cols="3">
                      <v-select
                        v-model="estado_civil"
                        label="Estado Civil"
                        :items="['Solteiro', 'Casado', 'Viúvo']"
                        :hide-details="!errors.estado_civil"
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
          :items="clientes"
          :search="search"
          :sort-by="[{key: 'nome', order: 'asc'}]"
          class="elevation-1 border-b"
          @reset="handleReset"
        >

          <template v-slot:item.actions="{ item: cliente }">
            <div class="align-center">
              <v-btn flat rounded @click="editarCliente(cliente)">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-pencil text-primary"
                     width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                     fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                </svg>
              </v-btn>
              <v-btn flat rounded @click="abrirExcluir(cliente)">
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

        <v-dialog
          v-model="isDialogExcluir"
          width="400px"
        >
          <v-card style="height: 227px;">
            <v-card-title class="pa-3 bg-primary">Excluir Cliente</v-card-title>

            <v-card-text>
              <v-row>
                <v-col>
                  Deseja realmente excluir este cliente <b>"{{ selectNome }}"</b>?
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat class="bg-error" @click="isDialogExcluir = false">Não</v-btn>
                    <v-btn @click.stop.prevent="excluirCliente(cliente)"
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
import messages from "@/utils/messages";
import {useAuth} from "@/store/auth";
import router from "@/router";

const isDialogExcluir = ref(false);
const isDialogOpen = ref(false);
const errorMessage = ref(null);
const authStore = useAuth();
const modo = ref('adicao');

const schema = yup.object({
  nome: yup.string().required('Nome é um campo obrigatório.'),
  cpf: yup.string().required('CPF é um campo obrigatório.'),
  rg: yup.string().required('RG é um campo obrigatório.'),
  endereco: yup.string().required('Endereço é um campo obrigatório.'),
  numero_casa: yup.string().required('N° é um campo obrigatório.'),
  bairro: yup.string().required('Bairro é um campo obrigatório.'),
  pais: yup.string().required('País é um campo obrigatório.'),
  estado: yup.string().required('Estado é um campo obrigatório.'),
  cidade: yup.string().required('Cidade é um campo obrigatório.'),
  telefone: yup.string().required('Celular é um campo obrigatório.'),
});

const {handleSubmit, errors, isSubmitting, handleReset} = useForm({
  validationSchema: schema
});

const selectedId = ref('');
const selectNome = ref('');

const {value: nome} = useField('nome');
const {value: cpf} = useField('cpf');
const {value: rg} = useField('rg');
const {value: endereco} = useField('endereco');
const {value: numero_casa} = useField('numero_casa');
const {value: bairro} = useField('bairro');
const {value: cep} = useField('cep');
const {value: referencia} = useField('referencia');
const {value: pais} = useField('pais');
const {value: estado} = useField('estado');
const {value: cidade} = useField('cidade');
const {value: rede_social} = useField('rede_social');
const {value: telefone} = useField('telefone');
const {value: sexo} = useField('sexo');
const {value: estado_civil} = useField('estado_civil');

function abrirExcluir(user) {
  isDialogExcluir.value = true
  selectNome.value = user.nome
  selectedId.value = user.id
}

function excluirCliente() {
  authStore.excluirCliente(selectedId.value).then(() => {
    isDialogExcluir.value = false
    router.go();
  });
}

const submit = handleSubmit((value) => {
  errorMessage.value = null
  if ((selectedId.value == null || selectedId.value == '') && modo.value === 'adicao') {
    return authStore.cadastrarCliente(value)
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

const headers = ref([
  {title: "Nome", align: 'start', key: "nome"},
  {title: "Telefone", align: 'center', key: "telefone"},
  {title: "Ações", align: 'center', value: "actions"},
]);

const search = ref('');


function editarCliente(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'edicao';
  errorMessage.value = null

  if (modo.value === 'edicao') {
    nome.value = user.nome,
      cpf.value = user.cpf,
      rg.value = user.rg,
      endereco.value = user.endereco,
      numero_casa.value = user.numero_casa,
      bairro.value = user.bairro,
      cep.value = user.cep,
      referencia.value = user.referencia,
      pais.value = user.pais,
      estado.value = user.estado,
      cidade.value = user.cidade,
      rede_social.value = user.rede_social,
      telefone.value = user.telefone,
      sexo.value = user.sexo,
      estado_civil.value = user.estado_civil
  }

}

const clientes = ref([]);

onMounted(async () => {
  try {
    const response = await authStore.listaClientes();
    clientes.value = response.data.data;
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






