<template>
  <div class="q-pa-xs">
    <template v-for="(item, idx) in draftElement.variables" :key="idx">
      <q-card class="q-mb-sm" v-if="draftElement.variables[idx] !== undefined">
        <q-bar dense>
          <div class="text-weight-bold"> #{{ item.name }} </div>
          <q-space />
          <q-btn dense flat :label="item.type" class="q-mr-sm" align="right">
            <q-menu>
              <q-list dense separator>
                <q-item
                  clickable
                  v-close-popup
                  @click="changeVariableType(idx, 'number')"
                >
                  <q-item-section>Number</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="changeVariableType(idx, 'string')"
                >
                  <q-item-section>String</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="changeVariableType(idx, 'date-time')"
                >
                  <q-item-section>Date-Time</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="changeVariableType(idx, 'expression')"
                >
                  <q-item-section>Expression</q-item-section>
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
        <type-number
          v-if="draftElement.variables[idx]?.type === 'number'"
          v-model="draftElement.variables[idx]"
          @needs-evaluation="emit('needsEvaluation')"
        />
        <type-expression
          v-if="draftElement.variables[idx]?.type === 'expression'"
          v-model="draftElement.variables[idx]"
          @needs-evaluation="emit('needsEvaluation')"
        />
      </q-card>
    </template>
  </div>
</template>

<script setup lang="ts">
const draftElement = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT,
  required: true
});

const emit = defineEmits<{
  (e: "needsEvaluation"): void;
}>();

import TypeNumber from "@/components/QuestionsDraft/Variables/TypeNumberEditor.vue";
import TypeExpression from "@/components/QuestionsDraft/Variables/TypeExpressionEditor.vue";

import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";
import {
  updateVariables,
  getDefaultValue
} from "@/services/app-utils/variables/handle-variable-manipulation";

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

const changeVariableType = (
  idx: number,
  newType: GSK_DRAFT_ELEMENT["variables"][0]["type"]
) => {
  if (draftElement.value.variables[idx] === undefined) return;
  const newVariableDefaultValue = getDefaultValue(newType);
  newVariableDefaultValue.name = draftElement.value.variables[idx].name; // keep the same name
  draftElement.value.variables[idx] = newVariableDefaultValue;
};
</script>
