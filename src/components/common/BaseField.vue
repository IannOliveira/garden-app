<template>
  <div>
    <v-text-field
      v-if="type === 'text'"
      v-model="model"
      :label="label"
      :readonly="readonly"
      :error-messages="errorMessages"
      :hide-details="!showErrors ? true : 'auto'"
      variant="outlined"
      density="compact"
      rounded="lg"
      color="primary"
      :bg-color="readonly ? 'grey-lighten-4' : undefined"
      v-bind="$attrs"
    />
    <v-select
      v-else-if="type === 'select'"
      v-model="model"
      :items="items"
      :label="label"
      :readonly="readonly"
      :error-messages="errorMessages"
      :hide-details="!showErrors ? true : 'auto'"
      variant="outlined"
      density="compact"
      rounded="lg"
      color="primary"
      :bg-color="readonly ? 'grey-lighten-4' : undefined"
      v-bind="$attrs"
    />
    <slot v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: null,
  label:      { type: String,  default: '' },
  type:       { type: String,  default: 'text' },
  readonly:   { type: Boolean, default: false },
  items:      { type: Array,   default: () => [] },
  errors:     { type: [Array, Object, String], default: () => [] },
  showErrors: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const errorMessages = computed(() => props.errors || [])
</script>
