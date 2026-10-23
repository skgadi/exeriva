<template>
  <div class="q-pa-md q-gutter-md row justify-center items-start">
    <number-details-editor
      title="Real part"
      v-model:type="variable.typeReal"
      v-model:range="variable.rangeReal"
    />
    <number-details-editor
      title="Imaginary part"
      v-model:type="variable.typeImaginary"
      v-model:range="variable.rangeImaginary"
      v-model:show-elements="variable.isComplex"
      show-checkbox
    />
    <show-example-value
      :value-to-display="variable.variableDisplayValue"
      @refresh="refreshExampleValue"
    />
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
import ShowExampleValue from "@/components/QuestionsDraft/Variables/ShowExampleValue.vue";

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
    refreshExampleValue();
  },
  { deep: true }
);

const refreshExampleValue = () => {
  generateRandomNumber(variable.value);
  emit("needsEvaluation");
};
</script>
