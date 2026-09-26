<template>
  <div class="q-gutter-md row justify-center items-center">
    <number-details-editor
      :title="variable.isComplex ? 'Real part' : ''"
      v-model:type="variable.typeReal"
      v-model:range="variable.rangeReal"
    />
    <number-details-editor
      v-if="variable.isComplex"
      :title="'Imaginary part'"
      v-model:type="variable.typeImaginary"
      v-model:range="variable.rangeImaginary"
    />
  </div>
  <div>
    <q-checkbox v-model="variable.isComplex" label="Is it a complex number?" />
  </div>
  <div ref="texContent" class="q-pa-md">
    <display-tex :tex-content="`$${variable.variableDisplayValue}$`" />
  </div>
</template>

<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_VARIABLE_NUMBER,
  required: true
});

const emit = defineEmits<{
  (e: "needsEvaluation"): void;
}>();

import NumberDetailsEditor from "@/components/QuestionsDraft/Variables/NumberDetailsEditor.vue";
import DisplayTex from "@/components/ExtrasForQuasar/DisplayTex.vue";

import { watch } from "vue";
import { generateRandomNumber } from "@/services/app-utils/variables/generator";
import type { GSK_VARIABLE_NUMBER } from "@/library/types/variables";

watch(
  () => [
    variable.value.rangeReal,
    variable.value.typeReal,
    variable.value.rangeImaginary,
    variable.value.typeImaginary,
    variable.value.isComplex
  ],
  () => {
    generateRandomNumber(variable.value);
    emit("needsEvaluation");
  },
  { deep: true }
);
</script>
