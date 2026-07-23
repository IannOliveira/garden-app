<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600" persistent>
    <v-card rounded="xl">
      <div class="pa-5 d-flex align-center justify-space-between bg-primary">
        <div class="d-flex align-center ga-3">
          <v-icon icon="mdi-credit-card-check-outline" size="28" color="white" />
          <h3 class="text-h6 font-weight-bold mb-0 text-white">Pagamento e Finalização</h3>
        </div>
        <v-btn icon="mdi-close" variant="text" color="white" density="comfortable" @click="close" />
      </div>

      <v-card-text class="pa-5">
        <v-row>
          <v-col cols="12" sm="6">
            <div class="mb-4">
              <span class="text-caption text-medium-emphasis">Total a Pagar</span>
              <p class="text-h5 font-weight-bold text-success mb-0">R$ {{ total }}</p>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="tipoPagamento"
              label="Forma de Pagamento"
              :items="opcoesPagamento"
              variant="outlined"
              density="comfortable"
              rounded="lg"
              color="primary"
              hide-details
            />
          </v-col>
        </v-row>

        <v-expand-transition>
          <div v-if="precisaParcelamento" class="mt-4 bg-grey-lighten-4 pa-4 rounded-lg">
            <div class="d-flex align-center justify-space-between mb-3">
              <span class="text-subtitle-2 font-weight-bold">Parcelamento</span>
              <div style="width: 140px">
                <v-select
                  v-model="numeroParcelas"
                  :items="[1, 2, 3, 4, 5, 6, 10, 12]"
                  label="Qtd. Parcelas"
                  variant="outlined"
                  density="compact"
                  hide-details
                  bg-color="white"
                  @update:modelValue="gerarParcelas"
                />
              </div>
            </div>

            <v-list class="bg-transparent pa-0">
              <v-list-item
                v-for="(parcela, idx) in parcelas"
                :key="idx"
                class="px-0 mb-2"
              >
                <v-row dense align="center">
                  <v-col cols="2">
                    <v-chip size="small" color="primary" variant="flat">{{ idx + 1 }}x</v-chip>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="parcela.valor"
                      prefix="R$"
                      density="compact"
                      variant="outlined"
                      bg-color="white"
                      hide-details
                      type="number"
                      step="0.01"
                      @change="recalcularValores(idx)"
                    />
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="parcela.data_vencimento"
                      type="date"
                      density="compact"
                      variant="outlined"
                      bg-color="white"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
            
            <div class="mt-2 text-right">
              <span class="text-caption text-medium-emphasis">Total Parcelado: </span>
              <span :class="{'text-error': totalParcelas !== Number(total), 'text-success': totalParcelas === Number(total)}" class="font-weight-bold">
                R$ {{ totalParcelas.toFixed(2) }}
              </span>
            </div>
          </div>
        </v-expand-transition>

      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" rounded="lg" @click="close">Cancelar</v-btn>
        <v-btn 
          color="success" 
          variant="flat" 
          rounded="lg" 
          prepend-icon="mdi-check" 
          :disabled="!isValido"
          @click="confirm"
          :loading="loading"
        >
          Confirmar Venda
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  total: { type: [Number, String], required: true },
  loading: Boolean
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const opcoesPagamento = ['DINHEIRO', 'PIX', 'CARTÃO DE DÉBITO', 'CARTÃO DE CRÉDITO', 'A PRAZO / BOLETO'];
const tipoPagamento = ref('DINHEIRO');
const numeroParcelas = ref(1);
const parcelas = ref([]);

const precisaParcelamento = computed(() => {
  return ['CARTÃO DE CRÉDITO', 'A PRAZO / BOLETO'].includes(tipoPagamento.value);
});

const totalParcelas = computed(() => {
  return parcelas.value.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0);
});

const isValido = computed(() => {
  if (!tipoPagamento.value) return false;
  if (precisaParcelamento.value) {
    if (parcelas.value.length === 0) return false;
    // Evita diferença de arredondamento boba
    if (Math.abs(totalParcelas.value - parseFloat(props.total)) > 0.05) return false;
    // Todas as datas preenchidas
    if (parcelas.value.some(p => !p.data_vencimento)) return false;
  }
  return true;
});

const close = () => {
  emit('update:modelValue', false);
};

const confirm = () => {
  emit('confirm', {
    tipoPagamento: tipoPagamento.value,
    parcelas: precisaParcelamento.value ? parcelas.value : []
  });
};

const gerarParcelas = () => {
  if (!precisaParcelamento.value) {
    parcelas.value = [];
    return;
  }

  const num = numeroParcelas.value || 1;
  const valorTotal = parseFloat(props.total) || 0;
  const valorBase = Math.floor((valorTotal / num) * 100) / 100;
  let diferenca = valorTotal - (valorBase * num);

  parcelas.value = [];
  let dataAtual = new Date();

  for (let i = 0; i < num; i++) {
    // Adiciona 30 dias para cada parcela
    dataAtual.setDate(dataAtual.getDate() + 30);
    
    let valorParcela = valorBase;
    if (i === 0) { // Adiciona a diferença na primeira parcela
      valorParcela += diferenca;
    }

    parcelas.value.push({
      valor: valorParcela.toFixed(2),
      data_vencimento: dataAtual.toISOString().split('T')[0]
    });
  }
};

const recalcularValores = (idxModificado) => {
  // Lógica simples: se mexeu no valor de um, tenta ajustar os próximos para fechar o total
  // Como é complexo fazer um auto-ajuste perfeito, deixaremos o usuário ajustar manualmente
  // O botão de confirmar só habilita se o total bater.
};

watch(tipoPagamento, () => {
  gerarParcelas();
});

watch(() => props.modelValue, (val) => {
  if (val) {
    tipoPagamento.value = 'DINHEIRO';
    numeroParcelas.value = 1;
    parcelas.value = [];
  }
});
</script>
