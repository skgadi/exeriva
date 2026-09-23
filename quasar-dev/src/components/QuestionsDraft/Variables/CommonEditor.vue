<template>
  <div class="row justify-around">
    <q-tabs
      v-model="variableSizeType"
      dense
      align="justify"
      inline-label
      no-caps
      :breakpoint="0"
    >
      <template v-for="size in sizesOfVariable" :key="size.id">
        <q-tab :name="size.id" :label="size.display" :icon="size.icon" />
      </template>
    </q-tabs>
    <div>
      <div class="q-gutter-md row justify-evenly">
        <q-input
          v-model.number="variable.size[0]"
          type="number"
          dense
          outlined
          min="1"
          label="# of rows"
          class="q-mr-sm"
          @update:model-value="enforceMin"
        />
        <q-input
          v-model.number="variable.size[1]"
          type="number"
          dense
          outlined
          min="1"
          label="# of columns"
          @update:model-value="enforceMin"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_DRAFT_ELEMENT["variables"][number],
  required: true
});

import { ref, watch } from "vue";
import type { GSK_DRAFT_ELEMENT } from "@/library/types/questions";

const sizesOfVariable = [
  {
    id: "scalar",
    display: "Scalar",
    icon: "mdi-crop-square"
  },
  {
    id: "vector",
    display: "Vector",
    icon: "mdi-table-column"
  },
  {
    id: "matrix",
    display: "Matrix",
    icon: "mdi-grid"
  }
];

const getVariableSizeType = (inVariable: Array<number>) => {
  if (inVariable[0] === undefined || inVariable[1] === undefined) {
    return "scalar";
  }
  if (inVariable[0] === 1 && inVariable[1] === 1) {
    return "scalar";
  } else if (inVariable[0] > 1 && inVariable[1] === 1) {
    return "vector";
  } else if (inVariable[0] > 1 || inVariable[1] > 1) {
    return "matrix";
  }
  return "scalar";
};

const variableSizeType = ref(getVariableSizeType(variable.value.size));
watch(variableSizeType, newValue => {
  if (newValue === "scalar") {
    variable.value.size = [1, 1];
  }
  if (newValue === "vector") {
    variable.value.size = [Math.max(variable.value.size[0], 2), 1];
  }
  if (newValue === "matrix") {
    variable.value.size = [
      Math.max(variable.value.size[0], 2),
      Math.max(variable.value.size[1], 2)
    ];
  }
});

watch(
  () => variable.value.size,
  newValue => {
    variableSizeType.value = getVariableSizeType(newValue);
  },
  { deep: true }
);

const enforceMin = (val: string | number | null): void => {
  if (val === null || val === "" || Number(val) < 1) {
    variable.value.size[0] = Math.max(variable.value.size[0], 1);
    variable.value.size[1] = Math.max(variable.value.size[1], 1);
  }
};
</script>
