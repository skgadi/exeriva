<template>
  <q-select
    v-model="roundTo"
    v-if="type === 'rational'"
    :options="Array.from({ length: 16 }, (_, i) => i)"
    label="Number of digits in numerator"
    style="min-width: 150px"
    dense
    outlined
    emit-value
    map-options
  />
</template>
<script setup lang="ts">
const roundTo = defineModel({
  type: Number as () => GSK_NUMBER_TYPE["roundTo"],
  required: true
});

const props = defineProps({
  type: {
    type: String as () => GSK_NUMBER_TYPE["type"],
    required: true
  }
});

import type { GSK_NUMBER_TYPE } from "@/library/types/variables";
</script>
