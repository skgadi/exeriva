<template>
  <div>
    <q-input
      filled
      v-model="variable.expression"
      label="Expression"
      placeholder="Enter an expression"
    />
  </div>
  <div class="q-pa-md q-gutter-md row justify-center items-center">
    <number-details-editor
      :title="'Real part'"
      :show-type="false"
      :show-round-to="false"
      :show-numerator-digits="false"
      v-model:type="variable.typeReal"
    />
    <number-details-editor
      :title="'Imaginary part'"
      :show-type="false"
      :show-round-to="false"
      :show-numerator-digits="false"
      v-model:type="variable.typeImaginary"
    />
  </div>
  <div class="q-pa-md">
    <display-tex :tex-content="`$${variable.variableDisplayValue}$`" />
  </div>
</template>
<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_VARIABLE_EXPRESSION,
  required: true
});

const emit = defineEmits<{
  (e: "needsEvaluation"): void;
}>();

import DisplayTex from "@/components/ExtrasForQuasar/DisplayTex.vue";
import NumberDetailsEditor from "@/components/QuestionsDraft/Variables/NumberDetailsEditor.vue";

import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";
import { watch } from "vue";
import { displayVariable } from "@/services/app-utils/variables/viewer";
import * as math from "mathjs";

watch(
  () => [
    variable.value.expression,
    variable.value.typeReal,
    variable.value.typeImaginary
  ],
  () => {
    emit("needsEvaluation");
  },
  { deep: true }
);

watch(
  () => variable.value.variableValue,
  () => {
    const varVal = JSON.parse(
      JSON.stringify(variable.value, math.replacer),
      math.reviver
    ) as GSK_VARIABLE_EXPRESSION;
    displayVariable(varVal);
    variable.value.variableDisplayValue = `${varVal.variableDisplayValue}`;
  }
);
</script>
