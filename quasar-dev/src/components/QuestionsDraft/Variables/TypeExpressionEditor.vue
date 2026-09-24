<template>
  <div>
    <q-input
      filled
      v-model="variable.expression"
      label="Expression"
      placeholder="Enter an expression"
    />
  </div>
  <div class="q-pa-md">
    <display-tex :tex-content="variable.variableDisplayValue" />
  </div>
</template>
<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_VARIABLE_EXPRESSION,
  required: true
});

import DisplayTex from "@/components/ExtrasForQuasar/DisplayTex.vue";

import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";
</script>
