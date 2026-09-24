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
  <div ref="texContent">
    Example Value: ${{ variable.variableDisplayValue }}$
  </div>
</template>

<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_VARIABLE_NUMBER,
  required: true
});

import NumberDetailsEditor from "@/components/QuestionsDraft/Variables/NumberDetailsEditor.vue";

import { watch } from "vue";
//import { displayVariable } from "@/services/app-utils/variables/viewer";
import { generateRandomNumber } from "@/services/app-utils/variables/generator";
import type { GSK_VARIABLE_NUMBER } from "@/library/types/variables";

watch(
  () => [
    variable.value.rangeReal,
    variable.value.typeReal,
    variable.value.rangeImaginary,
    variable.value.typeImaginary,
    variable.value.isComplex,
    variable.value.size
  ],
  () => {
    generateRandomNumber(variable.value);
    renderMath();
  },
  { deep: true }
);

import "katex/dist/katex.min.css";
import renderMathInElement from "katex/contrib/auto-render";
import { nextTick, ref, onMounted } from "vue";

const texContent = ref<HTMLElement | null>(null);

const renderMath = async () => {
  await nextTick();

  if (!texContent.value) {
    return;
  }

  renderMathInElement(texContent.value, {
    delimiters: [
      {
        left: "$$",
        right: "$$",
        display: true
      },
      {
        left: "$",
        right: "$",
        display: false
      }
    ],
    throwOnError: false
  });
};

onMounted(() => {
  renderMath();
});
</script>
