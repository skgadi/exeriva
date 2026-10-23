<template>
  <q-input
    outlined
    dense
    v-model.number="value"
    :label="title"
    :min="min"
    :max="max"
    class="col"
    type="number"
  >
    <template v-slot:after>
      <q-select v-model="unit" outlined :options="units" dense />
    </template>
  </q-input>
</template>

<script setup lang="ts">
// 1. Model definitions
const value = defineModel<number | null | string>("value", { required: true });
const unit = defineModel<string>("unit", { required: true });

// 2. Props definition
defineProps<{
  units: string[];
  min: number;
  max: number;
  title: string;
}>();
</script>
