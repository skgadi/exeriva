<template>
  <q-select
    v-model="showFormat"
    :options="numberDisplayFormat"
    option-value="value"
    option-label="label"
    label="Display format"
    style="min-width: 150px"
    dense
    outlined
    emit-value
    map-options
  />
</template>
<script setup lang="ts">
const showFormat = defineModel({
  type: String as () => GSK_NUMBER_TYPE["showFormat"],
  required: true
});

import type { GSK_NUMBER_TYPE } from "@/library/types/variables";

const numberDisplayFormat = [
  {
    value: "decimal",
    label: "Decimal"
  },
  {
    value: "scientific",
    label: "Scientific"
  },
  {
    value: "engineering",
    label: "Engineering"
  },
  {
    value: "fraction",
    label: "Fraction"
  },
  {
    value: "mixed-fraction",
    label: "Mixed fraction"
  }
];
</script>
