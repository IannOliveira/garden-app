<template>

  <v-row>
    <v-col class="v-col-md-12 v-col-12">

    <v-card class="border mb-4">
      <v-card-item class="py-4 px-6">
        <div class="d-sm-flex align-center justify-space-between">
          <v-card-title class="text-h5">Clientes Cadastrados</v-card-title>


        <v-card-title class="d-flex">
          <v-btn @click="isDialogOpen = true" color="primary" aria-haspopup="dialog" aria-expanded="false">
            <v-icon class="mdi-account-multiple-plus mdi v-icon--size-default mr-2" aria-hidden="true">
            </v-icon>
              Adicionar cliente

          </v-btn>

          <v-dialog
            v-model="isDialogOpen"
            width="1000px"
          >
            <v-card>
              <v-card-title>Adicionar Cliente</v-card-title>

              <v-card-text>
                <v-row>
                  <v-col>
                    <v-text-field
                      label="Nome">
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="CPF">
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="RG">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      label="Endereço">
                    </v-text-field>
                  </v-col>
                  <v-col class="v-col-2">
                    <v-text-field
                      label="N°">
                    </v-text-field>
                  </v-col>
                  <v-col class="v-col-3">
                    <v-text-field
                      label="Bairro">
                    </v-text-field>
                  </v-col>
                  <v-col class="v-col-3">
                    <v-text-field
                      label="CEP">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      label="Referência">
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                      label="Email">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                <v-select
                  label="País"
                  :items="['Brasil', 'Angola', 'EUA']"
                />
                  </v-col>
                  <v-col>
                  <v-select
                    label="Estado"
                    :items="['PA', 'AP', 'TO']"
                  />
                  </v-col>
                  <v-col>
                  <v-select
                    label="Cidade"
                    :items="['Abaetetuba', 'Belém', 'Macapá']"
                  />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-text-field
                      label="Celular">
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      label="Sexo"
                      :items="['Masculino', 'Feminino']"
                    />
                  </v-col>
                  <v-col>
                    <v-select
                      label="Estado Civil"
                      :items="['Solteiro', 'Casado', 'Viúvo']"
                    />
                  </v-col>
                </v-row>

              </v-card-text>



              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="tonal" color="error" @click="isDialogOpen = false">Cancelar</v-btn>
                <v-btn variant="tonal" color="primary">Salvar</v-btn>
              </v-card-actions>
            </v-card>

          </v-dialog>
        </v-card-title>

        </div>
      </v-card-item>

      <v-divider aria-orientation="horizontal" role="separator" />

      <v-card-text>
        <v-row>
          <v-col class="v-col-md-3 v-col-12">
            <v-input>
              <v-field role="textbox">
                  <v-icon class="mdi-magnify mdi v-icon notranslate v-icon--size-default" aria-hidden="true"></v-icon><!---->


                <v-input placeholder="Procurar Cliente" size="1" type="text" id="input-16" aria-describedby="input-172-messages" class="v-field__input"></v-input>

              </v-field>
            </v-input>
          </v-col>
        </v-row>
      </v-card-text>

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
        <tr>
          <td class="text-subtitle-1">Iann</td>
          <td class="d-flex align-center py-4">ianncosta13@gmail.com</td>
          <td>
            <v-chip color="primary" variant="outlined" size="small">Ativo</v-chip>
          </td>
          <td>
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical" color="text" size="small" />
              </template>

              <v-card>
                <v-list density="compact" nav>
                  <v-list-item @click="isDialogOpen = true">
                    <template #prepend>
                      <v-icon icon="mdi-square-edit-outline" size="small" />
                    </template>

                    <v-list-item-title >Editar</v-list-item-title>
                  </v-list-item>

                  <v-list-item to="/">
                    <template #prepend>
                      <v-icon color="error" icon="mdi-delete-outline" size="small" />
                    </template>

                    <v-list-item-title>Deletar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </td>
        </tr>
        <tr>
          <td>Oliveira</td>
          <td>iann_costa@hotmail.com</td>
          <td>
            <v-chip color="error" variant="outlined" size="small">Inativo</v-chip>
          </td>
          <td>
            <v-menu>
              <template #activator="{ props }">
                <v-btn v-bind="props" icon="mdi-dots-vertical" color="text" size="small" />
              </template>

              <v-card>
                <v-list density="compact" nav>
                  <v-list-item @click="isDialogOpen = true">
                    <template #prepend>
                      <v-icon icon="mdi-square-edit-outline" size="small" />
                    </template>

                    <v-list-item-title>Editar</v-list-item-title>
                  </v-list-item>

                  <v-list-item to="/">
                    <template #prepend>
                      <v-icon color="error" icon="mdi-delete-outline" size="small" />
                    </template>

                    <v-list-item-title>Deletar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </td>
        </tr>
        <tr>
          <td>Costa</td>
          <td>iannjogo@gmail.com</td>
          <td>
            <v-chip color="primary" variant="outlined" size="small">Ativo</v-chip>
          </td>
          <td>
            <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" icon="mdi-dots-vertical" color="text" size="small" />
            </template>

            <v-card>
              <v-list density="compact" nav>
                <v-list-item @click="isDialogOpen = true">
                  <template #prepend>
                    <v-icon icon="mdi-square-edit-outline" size="small" />
                  </template>

                  <v-list-item-title>Editar</v-list-item-title>
                </v-list-item>

                <v-list-item to="/">
                  <template #prepend>
                    <v-icon color="error" icon="mdi-delete-outline" size="small" />
                  </template>

                  <v-list-item-title>Deletar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          </td>
        </tr>
        </tbody>
      </v-table>

    </v-card>

    </v-col>
  </v-row>

</template>

<script setup>

import { ref } from 'vue';

const isDialogOpen = ref(false);

</script>
