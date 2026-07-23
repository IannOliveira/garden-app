<template>
  <div>
    <!-- Page Header -->
    <div class="d-flex align-center justify-space-between mb-5">
      <div>
        <h1 class="text-h5 font-weight-bold">Faturamento</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          Nova ordem de venda
        </p>
      </div>

      <!-- Status badge -->
      <v-chip
        v-if="itens.length"
        color="success"
        variant="tonal"
        prepend-icon="mdi-cart-check"
        class="font-weight-bold"
      >
        {{ itens.length }} {{ itens.length === 1 ? 'item' : 'itens' }} no pedido
      </v-chip>
    </div>

    <!-- Main layout: 2 columns -->
    <v-row>
      <!-- ── LEFT PANEL ────────────────────────────────────────────── -->
      <v-col cols="12" lg="8">

        <!-- Step 1: Cliente -->
        <v-card variant="flat" border rounded="xl" class="mb-4">
          <div class="pa-4 d-flex align-center ga-3">
            <v-avatar color="primary" rounded="md" size="38" class="mr-3">
              <v-icon icon="mdi-account-outline" size="20" color="white" />
            </v-avatar>
            <div>
              <p class="text-subtitle-2 font-weight-bold mb-0">Identificação do Cliente</p>
              <p class="text-caption text-medium-emphasis mb-0">Selecione o cliente para vincular ao pedido</p>
            </div>
          </div>
          <v-divider />
          <div class="pa-4">
            <v-row dense align="center">
              <v-col cols="12" md="8">
                <v-autocomplete
                  v-model="clienteSelecionado"
                  :items="clientes"
                  item-title="nome"
                  item-value="id"
                  placeholder="Buscar cliente por nome ou telefone..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  color="primary"
                  hide-details
                  clearable
                  return-object
                  no-data-text="Nenhum cliente encontrado"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="item.raw.nome" :subtitle="item.raw.telefone">
                      <template v-slot:prepend>
                        <v-avatar color="primary" rounded="md" size="32" class="mr-2">
                          <span class="text-caption font-weight-bold text-white">
                            {{ item.raw.nome?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() }}
                          </span>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12" md="4">
              </v-col>
            </v-row>

            <!-- Selected Client Card -->
            <v-expand-transition>
              <div v-if="clienteSelecionado" class="mt-3">
                <v-card color="lightprimary" variant="flat" rounded="lg" class="pa-3">
                  <div class="d-flex align-center ga-3">
                    <v-avatar color="primary" rounded="md" size="42">
                      <span class="text-body-2 font-weight-bold text-white">
                        {{ clienteSelecionado.nome?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() }}
                      </span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <p class="text-body-2 font-weight-bold mb-0 text-primary">{{ clienteSelecionado.nome }}</p>
                      <p class="text-caption text-medium-emphasis mb-0">
                        <v-icon size="12" class="mr-1">mdi-phone-outline</v-icon>{{ clienteSelecionado.telefone || 'Sem telefone' }}
                        <span class="mx-2">·</span>
                        <v-icon size="12" class="mr-1">mdi-map-marker-outline</v-icon>{{ clienteSelecionado.cidade || 'Sem cidade' }}
                      </p>
                    </div>
                    <v-chip color="primary" size="x-small" variant="tonal">Selecionado</v-chip>
                  </div>
                </v-card>
              </div>
            </v-expand-transition>
          </div>
        </v-card>

        <!-- Step 2: Produtos -->
        <v-card variant="flat" border rounded="xl">
          <div class="pa-4 d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-3">
              <v-avatar color="success" rounded="md" size="38" class="mr-3">
                <v-icon icon="mdi-package-variant-closed" size="20" color="white" />
              </v-avatar>
              <div>
                <p class="text-subtitle-2 font-weight-bold mb-0">Produtos</p>
                <p class="text-caption text-medium-emphasis mb-0">Adicione os produtos ao pedido</p>
              </div>
            </div>

            <!-- Search + filter -->
            <div class="d-flex ga-2 align-center">
              <v-text-field
                v-model="searchProduto"
                prepend-inner-icon="mdi-magnify"
                placeholder="Buscar produto..."
                variant="outlined"
                density="compact"
                rounded="lg"
                hide-details
                clearable
                color="primary"
                style="min-width: 200px"
              />
              <v-btn-toggle
                v-model="viewMode"
                variant="outlined"
                rounded="lg"
                density="compact"
                mandatory
                color="primary"
              >
                <v-btn value="grid" icon="mdi-view-grid-outline" size="small" />
                <v-btn value="list" icon="mdi-view-list-outline" size="small" />
              </v-btn-toggle>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="px-4 pb-3 d-flex ga-2 flex-wrap">
            <v-chip
              v-for="cat in categorias"
              :key="cat"
              :color="categoriaAtiva === cat ? 'success' : 'default'"
              :variant="categoriaAtiva === cat ? 'flat' : 'tonal'"
              size="small"
              class="font-weight-medium"
              style="cursor: pointer"
              @click="categoriaAtiva = categoriaAtiva === cat ? null : cat"
            >
              {{ cat }}
            </v-chip>
          </div>

          <v-divider />

          <!-- Product Grid -->
          <div class="pa-4">
            <v-row v-if="viewMode === 'grid'" dense>
              <v-col
                v-for="produto in produtosFiltrados"
                :key="produto.id"
                cols="6"
                sm="4"
                md="3"
              >
                <v-card
                  variant="outlined"
                  rounded="xl"
                  class="product-card h-100"
                  :class="{ 'product-card--sem-estoque': !produto.quantidade || produto.quantidade <= 0 }"
                  @click="adicionarItem(produto)"
                >
                  <!-- Stock badge -->
                  <div class="product-badge-wrap">
                    <v-chip
                      size="x-small"
                      :color="produto.quantidade > 5 ? 'success' : produto.quantidade > 0 ? 'warning' : 'error'"
                      variant="flat"
                      class="font-weight-bold product-badge"
                    >
                      {{ produto.quantidade > 0 ? produto.quantidade + ' un.' : 'Sem estoque' }}
                    </v-chip>
                  </div>

                  <v-card-text class="pa-3 text-center">
                    <v-avatar color="success" rounded="xl" size="48" class="mb-2">
                      <v-icon icon="mdi-package-variant" size="24" color="white" />
                    </v-avatar>
                    <p class="text-caption font-weight-bold mb-1 text-truncate" :title="produto.nome_produto">
                      {{ produto.nome_produto }}
                    </p>
                    <p class="text-caption text-medium-emphasis mb-2">{{ produto.categoria }}</p>
                    <p class="text-body-2 font-weight-bold text-success mb-0">
                      R$ {{ parseFloat(produto.preco_venda || 0).toFixed(2) }}
                    </p>
                  </v-card-text>

                  <div class="product-add-overlay d-flex align-center justify-center">
                    <v-icon icon="mdi-plus-circle" size="36" color="white" />
                  </div>
                </v-card>
              </v-col>

              <!-- Empty state -->
              <v-col v-if="!produtosFiltrados.length" cols="12">
                <div class="py-10 text-center">
                  <v-icon size="52" color="grey-lighten-2" class="mb-3">mdi-package-variant-closed</v-icon>
                  <p class="text-body-2 text-medium-emphasis">Nenhum produto encontrado.</p>
                </div>
              </v-col>
            </v-row>

            <!-- Product List View -->
            <div v-else>
              <v-list lines="two" class="pa-0">
                <v-list-item
                  v-for="produto in produtosFiltrados"
                  :key="produto.id"
                  rounded="lg"
                  class="mb-1 product-list-item"
                  @click="adicionarItem(produto)"
                >
                  <template v-slot:prepend>
                    <v-avatar color="success" rounded="md" size="40" class="mr-3">
                      <v-icon icon="mdi-package-variant" size="20" color="white" />
                    </v-avatar>
                  </template>
                  <template v-slot:title>
                    <span class="text-body-2 font-weight-bold">{{ produto.nome_produto }}</span>
                  </template>
                  <template v-slot:subtitle>
                    <span class="text-caption">{{ produto.categoria }} · {{ produto.fabricante }}</span>
                  </template>
                  <template v-slot:append>
                    <div class="text-right">
                      <p class="text-body-2 font-weight-bold text-success mb-0">
                        R$ {{ parseFloat(produto.preco_venda || 0).toFixed(2) }}
                      </p>
                      <v-chip
                        size="x-small"
                        :color="produto.quantidade > 5 ? 'success' : produto.quantidade > 0 ? 'warning' : 'error'"
                        variant="tonal"
                        class="font-weight-bold mt-1"
                      >
                        {{ produto.quantidade > 0 ? produto.quantidade + ' un.' : 'Sem estoque' }}
                      </v-chip>
                    </div>
                  </template>
                </v-list-item>

                <div v-if="!produtosFiltrados.length" class="py-10 text-center">
                  <v-icon size="52" color="grey-lighten-2" class="mb-3">mdi-package-variant-closed</v-icon>
                  <p class="text-body-2 text-medium-emphasis">Nenhum produto encontrado.</p>
                </div>
              </v-list>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- ── RIGHT PANEL — Order Summary ──────────────────────────── -->
      <v-col cols="12" lg="4">
        <div class="order-panel-sticky">
          <v-card variant="flat" border rounded="xl">

            <!-- Panel Header -->
            <div class="pa-4 d-flex align-center ga-3">
              <v-avatar color="primary" rounded="md" size="38" class="mr-3">
                <v-icon icon="mdi-receipt-text-outline" size="20" color="white" />
              </v-avatar>
              <div class="flex-grow-1">
                <p class="text-subtitle-2 font-weight-bold mb-0">Resumo do Pedido</p>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ new Date().toLocaleDateString('pt-BR') }}
                </p>
              </div>
              <v-btn
                v-if="itens.length"
                icon="mdi-delete-sweep-outline"
                variant="text"
                color="error"
                density="comfortable"
                size="small"
                @click="limparPedido"
              />
            </div>

            <v-divider />

            <!-- Empty cart -->
            <div v-if="!itens.length" class="pa-8 text-center">
              <v-icon size="52" color="grey-lighten-2" class="mb-3">mdi-cart-outline</v-icon>
              <p class="text-body-2 text-medium-emphasis">Nenhum item adicionado</p>
              <p class="text-caption text-medium-emphasis">Clique em um produto para adicioná-lo</p>
            </div>

            <!-- Items list -->
            <div v-else>
              <v-list lines="two" class="pa-2">
                <v-list-item
                  v-for="(item, idx) in itens"
                  :key="item.id"
                  rounded="lg"
                  class="mb-1 item-row"
                >
                  <template v-slot:prepend>
                    <v-avatar color="lightsuccess" rounded="md" size="36" class="mr-2">
                      <v-icon icon="mdi-package-variant" size="18" color="success" />
                    </v-avatar>
                  </template>
                  <template v-slot:title>
                    <span class="text-caption font-weight-bold">{{ item.nome_produto }}</span>
                  </template>
                  <template v-slot:subtitle>
                    <span class="text-caption text-medium-emphasis">
                      R$ {{ parseFloat(item.preco_venda || 0).toFixed(2) }} / un.
                    </span>
                  </template>
                  <template v-slot:append>
                    <div class="d-flex align-center ga-1">
                      <v-btn
                        icon="mdi-minus"
                        variant="tonal"
                        color="grey"
                        density="compact"
                        size="x-small"
                        @click="decrementarItem(idx)"
                      />
                      <span class="text-body-2 font-weight-bold mx-1" style="min-width: 20px; text-align: center">
                        {{ item.qty }}
                      </span>
                      <v-btn
                        icon="mdi-plus"
                        variant="tonal"
                        color="success"
                        density="compact"
                        size="x-small"
                        @click="incrementarItem(idx)"
                      />
                      <v-btn
                        icon="mdi-close"
                        variant="text"
                        color="error"
                        density="compact"
                        size="x-small"
                        class="ml-1"
                        @click="removerItem(idx)"
                      />
                    </div>
                  </template>
                </v-list-item>
              </v-list>

              <v-divider class="mx-3" />

              <!-- Subtotals -->
              <div class="pa-4">
                <div class="d-flex justify-space-between mb-2">
                  <span class="text-body-2 text-medium-emphasis">Subtotal</span>
                  <span class="text-body-2">R$ {{ subtotal }}</span>
                </div>

                <!-- Desconto -->
                <div class="d-flex align-center justify-space-between mb-3">
                  <span class="text-body-2 text-medium-emphasis">Desconto</span>
                  <div style="width: 120px">
                    <v-text-field
                      v-model="desconto"
                      prefix="R$"
                      density="compact"
                      variant="outlined"
                      rounded="lg"
                      hide-details
                      type="number"
                      min="0"
                      color="success"
                      style="font-size: 0.8rem"
                    />
                  </div>
                </div>

                <v-divider class="mb-3" />

                <!-- Total -->
                <div class="d-flex justify-space-between align-center mb-4">
                  <span class="text-subtitle-2 font-weight-bold">Total</span>
                  <span class="text-h6 font-weight-bold text-success">R$ {{ total }}</span>
                </div>

                <!-- Observação -->
                <v-textarea
                  v-model="observacao"
                  label="Observação (opcional)"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  color="primary"
                  hide-details
                  rows="2"
                  auto-grow
                  class="mb-4"
                />

                <!-- Confirm Button -->
                <v-btn
                  block
                  color="success"
                  variant="flat"
                  rounded="lg"
                  size="large"
                  :disabled="!clienteSelecionado || !itens.length"
                  prepend-icon="mdi-check-circle-outline"
                  class="font-weight-bold"
                  @click="confirmarPedido"
                >
                  Confirmar Pedido
                </v-btn>

                <!-- Validation hint -->
                <p
                  v-if="!clienteSelecionado || !itens.length"
                  class="text-caption text-medium-emphasis text-center mt-2"
                >
                  <v-icon size="12" class="mr-1">mdi-information-outline</v-icon>
                  Selecione um cliente e os produtos
                </p>
              </div>
            </div>
          </v-card>

          <!-- Quick stats -->
          <v-card variant="flat" border rounded="xl" class="mt-3 pa-3">
            <div class="d-flex justify-space-around text-center">
              <div>
                <p class="text-h6 font-weight-bold text-primary mb-0">{{ itens.length }}</p>
                <p class="text-caption text-medium-emphasis mb-0">Itens</p>
              </div>
              <v-divider vertical />
              <div>
                <p class="text-h6 font-weight-bold text-success mb-0">{{ totalUnidades }}</p>
                <p class="text-caption text-medium-emphasis mb-0">Unidades</p>
              </div>
              <v-divider vertical />
              <div>
                <p class="text-h6 font-weight-bold text-warning mb-0">R$ {{ desconto || '0.00' }}</p>
                <p class="text-caption text-medium-emphasis mb-0">Desconto</p>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <!-- ── Confirm Dialog ─────────────────────────────────────────── -->
    <!-- ── Confirm Dialog / Payment Dialog ────────────────────────────────── -->
    <PaymentDialog 
      v-model="dialogConfirmar" 
      :total="total" 
      :loading="faturamentoStore.loading"
      @confirm="finalizarPedido"
    />

    <!-- ── Success Snackbar ── -->
    <v-snackbar
      v-model="snackbar"
      color="success"
      rounded="lg"
      location="top right"
      :timeout="4000"
    >
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-check-circle-outline" />
        <span>Pedido registrado com sucesso!</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useClienteStore }  from '@/store/clienteStore';
import { useProdutoStore }  from '@/store/produtoStore';
import { useFaturamentoStore } from '@/store/faturamentoStore';
import PaymentDialog from '@/components/Faturamento/PaymentDialog.vue';

const clienteStore = useClienteStore();
const produtoStore = useProdutoStore();
const faturamentoStore = useFaturamentoStore();

const { clientes }  = storeToRefs(clienteStore);
const { produtos }  = storeToRefs(produtoStore);

// ── State ──────────────────────────────────────────────────────────────────
const clienteSelecionado = ref(null);
const itens              = ref([]);           // [{ ...produto, qty: N }]
const searchProduto      = ref('');
const categoriaAtiva     = ref(null);
const viewMode           = ref('grid');
const desconto           = ref('');
const observacao         = ref('');
const dialogConfirmar    = ref(false);
const snackbar           = ref(false);

// ── Computed ────────────────────────────────────────────────────────────────
const categorias = computed(() => {
  const cats = [...new Set(produtos.value.map(p => p.categoria).filter(Boolean))];
  return cats;
});

const produtosFiltrados = computed(() => {
  return produtos.value.filter(p => {
    const matchSearch = !searchProduto.value ||
      p.nome_produto?.toLowerCase().includes(searchProduto.value.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(searchProduto.value.toLowerCase());
    const matchCat = !categoriaAtiva.value || p.categoria === categoriaAtiva.value;
    return matchSearch && matchCat;
  });
});

const subtotal = computed(() => {
  const val = itens.value.reduce((acc, item) => {
    return acc + (parseFloat(item.preco_venda || 0) * item.qty);
  }, 0);
  return val.toFixed(2);
});

const total = computed(() => {
  const desc = parseFloat(desconto.value) || 0;
  const val  = Math.max(parseFloat(subtotal.value) - desc, 0);
  return val.toFixed(2);
});

const totalUnidades = computed(() =>
  itens.value.reduce((acc, item) => acc + item.qty, 0)
);

// ── Actions ─────────────────────────────────────────────────────────────────
const adicionarItem = (produto) => {
  const semEstoque = !produto.quantidade || produto.quantidade <= 0;
  if (semEstoque) return;

  const existing = itens.value.find(i => i.id === produto.id);
  if (existing) {
    if (existing.qty < produto.quantidade) {
      existing.qty++;
    } else {
      alert('Estoque máximo atingido para ' + produto.nome_produto);
    }
  } else {
    itens.value.push({ ...produto, qty: 1 });
  }
};

const incrementarItem = (idx) => {
  const item = itens.value[idx];
  if (item.qty < item.quantidade) {
    item.qty++;
  } else {
    alert('Estoque máximo atingido para ' + item.nome_produto);
  }
};

const decrementarItem = (idx) => {
  if (itens.value[idx].qty > 1) {
    itens.value[idx].qty--;
  } else {
    removerItem(idx);
  }
};

const removerItem = (idx) => {
  itens.value.splice(idx, 1);
};

const limparPedido = () => {
  itens.value    = [];
  desconto.value = '';
  observacao.value = '';
};

const confirmarPedido = () => {
  dialogConfirmar.value = true;
};

const finalizarPedido = async (paymentData) => {
  const payload = {
    cliente_id:    clienteSelecionado.value?.id,
    tipo_pagamento: paymentData.tipoPagamento,
    itens:          itens.value.map(i => ({ produto_id: i.id, qty: i.qty, preco: parseFloat(i.preco_venda || 0) })),
    desconto:       parseFloat(desconto.value) || 0,
    total:          parseFloat(total.value),
    observacao:     observacao.value,
    parcelas:       paymentData.parcelas
  };

  try {
    await faturamentoStore.createFaturamento(payload);
    dialogConfirmar.value = false;
    snackbar.value = true;

    // Reset
    clienteSelecionado.value = null;
    limparPedido();

    // Refresh products to update stock visually
    produtoStore.fetchProdutos();
  } catch (error) {
    console.error('Erro ao finalizar pedido:', error);
    alert('Erro ao finalizar pedido: ' + (error.response?.data?.error || 'Verifique o console.'));
  }
};

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  if (!clientes.value.length)  clienteStore.fetchClientes().catch(() => {});
  if (!produtos.value.length)  produtoStore.fetchProdutos().catch(() => {});
});
</script>

<style scoped>
/* ── Order panel sticky ─────────────────────────────── */
.order-panel-sticky {
  position: sticky;
  top: 80px;
}

/* ── Product card grid ──────────────────────────────── */
.product-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10) !important;
  border-color: rgb(var(--v-theme-success)) !important;
}
.product-card--sem-estoque {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* Add overlay on hover */
.product-add-overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--v-theme-success), 0.72);
  opacity: 0;
  transition: opacity 0.18s ease;
  border-radius: inherit;
}
.product-card:hover .product-add-overlay {
  opacity: 1;
}

/* Stock badge */
.product-badge-wrap {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

/* ── Product list view ──────────────────────────────── */
.product-list-item {
  cursor: pointer;
  transition: background 0.15s ease;
}
.product-list-item:hover {
  background: rgb(var(--v-theme-lightsuccess)) !important;
}

/* ── Item rows in cart ──────────────────────────────── */
.item-row {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px !important;
}
</style>
