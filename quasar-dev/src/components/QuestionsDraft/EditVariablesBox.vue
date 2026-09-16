<template>
  <template v-for="(item, idx) in draftElement.variables" :key="idx">
    <q-item-label class="text-h6">{{ item.name }}</q-item-label>
    <q-item-label caption>
      Size: {{ item.size[0] }} x {{ item.size[1] }}
    </q-item-label>
  </template>
</template>

<script setup lang="ts">
const draftElement = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT,
  required: true
});

import { watch } from "vue";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import type { GSK_VARIABLE_NUMBER } from "@/library/types/variables";
import { extractVariablesFromText } from "@/services/app-utils/questions/variables";

watch(
  () => draftElement.value,
  newValue => {
    const variablesInElement = extractVariablesFromText(newValue.text);
    // variablesInElement is the correct one. We keep the order from draftElements.variables
    // but we also add any new variables that are in the text but not in the variables array
    // We also remove any variables that are in the variables array but not in the text
    const newVariables = variablesInElement.filter(
      variable => !newValue.variables.some(v => v.name === variable)
    );
    const removedVariables = newValue.variables.filter(
      variable => !variablesInElement.includes(variable.name)
    );
    draftElement.value.variables = [
      ...newValue.variables.filter(
        variable => !removedVariables.some(v => v.name === variable.name)
      ),

      ...newVariables.map(
        variable =>
          ({
            name: variable,
            size: [1, 1], // default size for new variables
            rangeReal: [1, 9],
            rangeComplex: [0, 0],
            typeReal: {
              type: "integer",
              showFormat: "decimal",
              roundTo: 0
            },
            typeComplex: {
              type: "integer",
              showFormat: "decimal",
              roundTo: 0
            },
            isComplex: false
          }) as GSK_VARIABLE_NUMBER
      )
    ];
    //console.log("draftElement changed:", newValue);
  },
  { immediate: true }
);
</script>
