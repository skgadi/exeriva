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
    <div class="col-auto" style="writing-mode: sideways-lr" v-if="title">{{
      title
    }}</div>
    <div class="col">
      <q-select
        v-model="type.type"
        :options="numberTypes"
        option-value="id"
        option-label="display"
        label="Number type"
        style="min-width: 150px"
        dense
        outlined
        emit-value
        map-options
      />
      <q-select
        v-model="type.showFormat"
        :options="numberDisplayFormat"
        option-value="value"
        option-label="label"
        label="Display format"
        style="min-width: 150px"
        dense
        outlined
        emit-value
        map-options
      />
      <q-input
        v-model.number="type.roundTo"
        type="number"
        dense
        outlined
        label="Round to"
        min="0"
        @update:model-value="enforceMin"
      />
      <q-input
        v-model.number="range[0]"
        type="number"
        dense
        outlined
        label="Minimum value"
        @update:model-value="adjustMinMax"
      />
      <q-input
        v-model.number="range[1]"
        type="number"
        dense
        outlined
        label="Maximum value"
        @update:model-value="adjustMinMax"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: false
  }
});
const type = defineModel("type", {
  type: Object as () => GSK_NUMBER_TYPE,
  required: true
});

const range = defineModel("range", {
  type: Object as () => GSK_VARIABLE_NUMBER["rangeReal"],
  required: true
});

import type {
  GSK_NUMBER_TYPE,
  GSK_VARIABLE_NUMBER
} from "@/library/types/variables";

const numberTypes = [
  {
    id: "integer",
    display: "Integer"
  },
  {
    id: "rational",
    display: "Rational"
  },
  {
    id: "decimal",
    display: "Decimal"
  }
];

const numberDisplayFormat = [
  {
    value: "decimal",
    label: "Decimal"
  },
  {
    value: "scientific",
    label: "Scientific"
  },
  {
    value: "engineering",
    label: "Engineering"
  },
  {
    value: "fraction",
    label: "Fraction"
  },
  {
    value: "mixed-fraction",
    label: "Mixed fraction"
  }
];

const enforceMin = (val: string | number | null): void => {
  if (val === null || val === "" || Number(val) < 0) {
    type.value.roundTo = 0;
  }
};

const adjustMinMax = (val: string | number | null): void => {
  if (val === null || val === "") {
    val = 0;
  }
  range.value[0] = range.value[0] === null ? 0 : Number(range.value[0]);
  range.value[1] = range.value[1] === null ? 9 : Number(range.value[1]);
  if (range.value[0] > range.value[1]) {
    const temp = range.value[0];
    range.value[0] = range.value[1];
    range.value[1] = temp;
  }
};
</script>
