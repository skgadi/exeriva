<template>
  <div
    style="
      width: 200px;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 0px;
    "
    class="row justify-center items-center bg-grey-2"
  >
    <div class="col">
      <div class="text-center">
        <q-checkbox v-model="isAnswerable" label="Is it answerable?" />
      </div>
      <template v-if="variable.studentAnswer !== undefined">
        <q-select
          v-model="variable.studentAnswer.requiredPrecision"
          :options="Array.from({ length: 16 }, (_, i) => i)"
          label="Required precision"
          style="min-width: 150px"
          dense
          outlined
          emit-value
          map-options
        />
        <q-input
          v-model.number="variable.studentAnswer.credit"
          type="number"
          dense
          outlined
          label="Credit"
        />
        <q-input
          v-model.number="variable.studentAnswer.expectedTime"
          type="number"
          dense
          outlined
          label="Expected Time (seconds)"
        />
        <q-checkbox
          v-model="variable.studentAnswer.maintainStrictTimeLimit"
          label="Is time strict?"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_VARIABLE_EXPRESSION,
  required: true
});

import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";
import { ref, watch } from "vue";
import { setIsExpressionAnswerable } from "@/services/app-utils/variables/handle-variable-manipulation";

const isAnswerable = ref(variable.value.studentAnswer !== undefined);
watch(
  () => isAnswerable.value,
  () => {
    setIsExpressionAnswerable(variable.value, isAnswerable.value);
  }
);
</script>
