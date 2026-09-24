<template>
  <template v-for="(item, idx) in draftElement.variables" :key="idx">
    <q-card class="q-mb-sm" v-if="draftElement.variables[idx] !== undefined">
      <q-bar dense>
        <div class="text-weight-bold"> #{{ item.name }} </div>
        <q-space />
        <q-btn dense flat :label="item.type" class="q-mr-sm" align="right">
          <q-menu>
            <q-list dense separator>
              <q-item clickable v-close-popup @click="item.type = 'number'">
                <q-item-section>Number</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="item.type = 'string'">
                <q-item-section>String</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="item.type = 'date-time'">
                <q-item-section>Date-Time</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          dense
          flat
          round
          icon="mdi-menu-up-outline"
          :disabled="idx === 0"
          @click="moveVariable(idx, -1)"
          title="Move variable up"
        />
        <q-btn
          dense
          flat
          round
          icon="mdi-menu-down-outline"
          :disabled="idx === draftElement.variables.length - 1"
          @click="moveVariable(idx, 1)"
          title="Move variable down"
        />
      </q-bar>
      <div class="q-py-xs">
        <common-editor v-model="draftElement.variables[idx]" />
      </div>
      <type-number
        v-if="draftElement.variables[idx]?.type === 'number'"
        v-model="draftElement.variables[idx]"
      />
    </q-card>
  </template>
</template>

<script setup lang="ts">
const draftElement = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT,
  required: true
});

import CommonEditor from "@/components/QuestionsDraft/Variables/CommonEditor.vue";
import TypeNumber from "@/components/QuestionsDraft/Variables/TypeNumberEditor.vue";

import { watch } from "vue";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import type { GSK_VARIABLE_NUMBER } from "@/library/types/variables";
import { extractVariablesFromText } from "@/services/app-utils/variables/generator";
import * as math from "mathjs";

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
            type: "number",
            name: variable,
            size: [1, 1], // default size for new variables
            rangeReal: [1, 9],
            rangeImaginary: [0, 0],
            typeReal: {
              type: "integer",
              showFormat: "decimal",
              roundTo: 0
            },
            typeImaginary: {
              type: "integer",
              showFormat: "decimal",
              roundTo: 0
            },
            isComplex: false,
            variableValue: math.zeros(1, 1), // default value for new variables
            variableDisplayValue: "1"
          }) as GSK_VARIABLE_NUMBER
      )
    ];
    //console.log("draftElement changed:", newValue);
  },
  { immediate: true }
);

const moveVariable = (idx: number, direction: number) => {
  const newIndex = idx + direction;
  if (newIndex < 0 || newIndex >= draftElement.value.variables.length) {
    return;
  }
  const temp = draftElement.value.variables[idx];
  if (temp === undefined) return;
  if (draftElement.value.variables[newIndex] === undefined) return;
  draftElement.value.variables[idx] = draftElement.value.variables[newIndex];
  draftElement.value.variables[newIndex] = temp;
};
</script>
