<template>
  <edit-number-and-unit
    v-model:value="inputStyleModel.width"
    v-model:unit="inputStyleModel.widthUnit"
    :units="['px', '%', 'em', 'rem']"
    :max="Infinity"
    :min="0"
    :title="'Width'"
  />
  <edit-number-and-unit
    v-model:value="inputStyleModel.fontSize"
    v-model:unit="inputStyleModel.fontSizeUnit"
    :units="['px', '%', 'em', 'rem']"
    :max="Infinity"
    :min="0"
    :title="'Font size'"
  />
  <q-input
    outlined
    dense
    v-model.number="inputStyleModel.zoom"
    type="number"
    :label="'Zoom'"
    class="my-input"
  />
  <q-select
    outlined
    v-model="inputStyleModel.textAlign"
    :options="['left', 'center', 'right']"
    dense
    label="Text align"
  />
  <edit-number-and-unit
    v-model:value="inputStyleModel.borderThickness"
    v-model:unit="inputStyleModel.borderThicknessUnit"
    :units="['px', '%', 'em', 'rem']"
    :max="Infinity"
    :min="0"
    :title="'Border thickness'"
  />
  <edit-number-and-unit
    v-model:value="inputStyleModel.borderRadius"
    v-model:unit="inputStyleModel.borderRadiusUnit"
    :units="['px', '%', 'em', 'rem']"
    :max="Infinity"
    :min="0"
    :title="'Border radius'"
  />
  <q-input
    outlined
    v-model="inputStyleModel.borderColor"
    dense
    label="Border color"
  >
    <template #append>
      <q-icon name="colorize" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-color v-model="inputStyleModel.borderColor" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <q-select
    outlined
    v-model="inputStyleModel.borderStyle"
    :options="[
      'solid',
      'dashed',
      'dotted',
      'double',
      'groove',
      'ridge',
      'inset',
      'outset'
    ]"
    dense
    label="Border style"
  />
  <q-input
    outlined
    v-model="inputStyleModel.backgroundColor"
    dense
    label="Background color"
  >
    <template #append>
      <q-icon name="colorize" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-color v-model="inputStyleModel.backgroundColor" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <q-input
    outlined
    v-model="inputStyleModel.textColor"
    dense
    label="Text color"
  >
    <template #append>
      <q-icon name="colorize" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-color v-model="inputStyleModel.textColor" />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
const inputStyleModel = defineModel({
  type: Object as () => GSK_STUDENT_ANSWER["style"],
  required: true
});

import EditNumberAndUnit from "@/components/QuestionsDraft/Variables/EditNumberAndUnit.vue";

import type { GSK_STUDENT_ANSWER } from "@/library/types/variables";
</script>
