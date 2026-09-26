<template>
  <q-select
    v-model="numberType"
    :options="numberTypes"
    option-value="id"
    option-label="display"
    label="Number type"
    style="min-width: 150px"
    dense
    outlined
    emit-value
    map-options
  />
</template>
<script setup lang="ts">
const numberType = defineModel({
  type: String as () => GSK_NUMBER_TYPE["type"],
  required: true
});

import type { GSK_NUMBER_TYPE } from "@/library/types/variables";

const numberTypes = [
  {
    id: "integer",
    display: "Integer"
  },
  {
    id: "rational",
    display: "Rational"
  },
  {
    id: "decimal",
    display: "Decimal"
  }
];
</script>
