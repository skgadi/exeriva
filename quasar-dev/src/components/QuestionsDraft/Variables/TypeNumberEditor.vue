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

    <div>
      {{ getRandomNumber(variable.rangeReal, variable.typeReal) }}
    </div>
  </div>
  <div>
    <q-checkbox v-model="variable.isComplex" label="Is it a complex number?" />
  </div>
</template>

<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_VARIABLE_NUMBER,
  required: true
});

import NumberDetailsEditor from "@/components/QuestionsDraft/Variables/NumberDetailsEditor.vue";

import { getRandomNumber } from "@/services/app-utils/questions/variables";
import type { GSK_VARIABLE_NUMBER } from "@/library/types/variables";
</script>
