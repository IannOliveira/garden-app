<template>
  <v-dialog v-model="internalValue" :width="width" scrollable>
    <v-card rounded="xl" :style="{ minHeight: '420px' }">

      <!-- Header -->
      <div class="dialog-header" :class="headerColorClass">
        <div class="d-flex align-center">
          <v-avatar :color="headerIconColor" size="40" class="mr-3">
            <v-icon :icon="headerIcon" size="22" color="white" />
          </v-avatar>
          <div>
            <p class="text-subtitle-1 font-weight-bold mb-0">{{ computedTitle }}</p>
            <p v-if="mode === 'visualizar'" class="text-caption mb-0 opacity-75">Modo somente leitura</p>
            <p v-else-if="mode === 'edicao'" class="text-caption mb-0 opacity-75">Edite os dados abaixo</p>
            <p v-else-if="mode === 'adicao'" class="text-caption mb-0 opacity-75">Preencha os dados abaixo</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" color="inherit" @click="internalValue = false" />
      </div>

      <v-divider />

      <!-- Content -->
      <v-card-text class="pa-5">
        <slot />
      </v-card-text>

      <!-- Actions -->
      <template v-if="hasActions">
        <v-divider />
        <v-card-actions class="pa-4">
          <slot name="actions" />
        </v-card-actions>
      </template>

    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  mode:       { type: String,  default: 'adicao' },
  width:      { type: [String, Number], default: '900px' },
  title:      { type: String,  default: '' },
})
const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

const internalValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const computedTitle = computed(() => {
  if (props.title) return props.title
  if (props.mode === 'visualizar') return 'Visualizar'
  if (props.mode === 'adicao')     return 'Novo Cadastro'
  if (props.mode === 'edicao')     return 'Editar'
  if (props.mode === 'pagamento')  return 'Registrar Pagamento'
  return ''
})

const headerColorClass = computed(() => {
  if (props.mode === 'visualizar') return 'header-info'
  if (props.mode === 'pagamento')  return 'header-success'
  return 'header-default'
})

const headerIconColor = computed(() => {
  if (props.mode === 'visualizar') return 'info'
  if (props.mode === 'pagamento')  return 'success'
  return 'primary'
})

const headerIcon = computed(() => {
  if (props.mode === 'visualizar') return 'mdi-eye-outline'
  if (props.mode === 'pagamento')  return 'mdi-cash-check'
  if (props.mode === 'edicao')     return 'mdi-pencil-outline'
  return 'mdi-plus-circle-outline'
})

const hasActions = computed(() => !!slots.actions)
</script>

<style scoped>
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.header-default {
  background: rgb(var(--v-theme-lightprimary));
  color: rgb(var(--v-theme-primary));
}

.header-info {
  background: rgb(var(--v-theme-lightsecondary));
  color: rgb(var(--v-theme-info));
}

.header-success {
  background: rgb(var(--v-theme-lightsuccess));
  color: rgb(var(--v-theme-success));
}
</style>
