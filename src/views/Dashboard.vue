<template>
  <v-row>
    <v-col class="v-col-md-12 v-col-12">

      <v-card class="border mb-4">
        <v-card-item class="py-4 px-6">
          <div class="d-sm-flex align-center justify-space-between">
            <v-card-title class="text-h5">Clientes Cadastrados</v-card-title>

            <v-card-title class="d-flex">
              <v-btn @click.prevent="abrirModal('adicao')" color="primary" aria-haspopup="dialog"
                     aria-expanded="false">
                <v-icon class="mdi-account-multiple-plus mdi v-icon--size-default mr-2" aria-hidden="true">
                </v-icon>
                Adicionar cliente
              </v-btn>

              <v-dialog
                v-model="isDialogOpen"
                width="1000px"
              >

                <v-card>
                  <v-card-title class="pa-4 bg-secondary">
                    <span class="title text-white">{{
                        modo === 'adicao' ? 'Adicionar Cliente' : 'Editar Cliente'
                      }} </span></v-card-title>
                  <v-data-table>
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
                              v-model="email"
                              label="Email"
                              :hide-details="!errors.email"
                              :error-messages="errors.email">
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
                  </v-data-table>

                </v-card>

              </v-dialog>
            </v-card-title>

          </div>
        </v-card-item>

        <v-divider aria-orientation="horizontal" role="separator"/>

        <v-table>
          <thead>
          <tr>
            <th class="text-subtitle-1 font-weight-semibold">Nome</th>
            <th class="text-subtitle-1 font-weight-semibold">Email</th>
            <th class="text-subtitle-1 font-weight-semibold">Situação</th>
            <th class="text-subtitle-1 font-weight-semibold">Ações</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="cliente in clientes" :key="cliente.id">
            <td>{{ cliente.nome }}</td>
            <td>{{ cliente.email }}</td>
            <td></td>
            <td class="v-col-2">
              <div class="d-flex align-center">
                <v-btn flat rounded @click.stop.prevent="editarCliente(cliente)">
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
            </td>

            <v-dialog
              v-model="isDialogExcluir"
              width="300px">

              <v-card>
                <v-card-title class="pa-3 bg-primary">Excluir Cliente</v-card-title>
                <v-data-table>
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
                </v-data-table>
              </v-card>
            </v-dialog>

          </tr>
          </tbody>

        </v-table>

      </v-card>

    </v-col>
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
  nome: yup.string().required().label('Nome'),
  cpf: yup.string().required().label('CPF').matches(/^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/),
  rg: yup.string().required().label('RG'),
  endereco: yup.string().required(),
  numero_casa: yup.string().required(),
  bairro: yup.string().required(),
  pais: yup.string().required(),
  estado: yup.string().required(),
  cidade: yup.string().required(),
  email: yup.string().required().email().label('E-mail'),
  telefone: yup.string().required(),
});

const {handleSubmit, errors, isSubmitting, handleReset} = useForm({
  validationSchema: schema
});

const selectedId = ref('');
const selectNome = ref('');

const {value: nome } = useField('nome');
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
const {value: email} = useField('email');
const {value: telefone} = useField('telefone');
const {value: sexo} = useField('sexo');
const {value: estado_civil} = useField('estado_civil');

function abrirExcluir(user) {
  selectNome.value = user.nome
  isDialogExcluir.value = true
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
    })
  }
})

function excluirCliente(user) {
  selectedId.value = user.id;
  authStore.excluirCliente(selectedId.value).then(() => {
    isDialogExcluir.value = false
    router.go();
  });
}

function editarCliente(user) {
  selectedId.value = user.id;
  isDialogOpen.value = true;
  modo.value = 'edicao';

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
      email.value = user.email,
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
});

function abrirModal() {
  isDialogOpen.value = true
  modo.value = 'adicao'
  handleReset()
}

</script>
