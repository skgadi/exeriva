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
      <div class="row items-center" v-if="title" style="height: 40px">
        <div class="col text-center">
          <template v-if="showCheckbox">
            <q-checkbox v-model="showElements" :label="title" />
          </template>
          <template v-else>
            {{ title }}
          </template>
        </div>
      </div>
      <template v-if="showElements">
        <number-editor
          v-model="type"
          :show-round-to="showRoundTo"
          :show-numerator-digits="showNumeratorDigits"
          :show-type="showType"
        />
        <q-input
          v-if="range"
          v-model.number="range[0]"
          type="number"
          dense
          outlined
          label="Minimum value"
          @update:model-value="adjustMinMax"
        />
        <q-input
          v-if="range"
          v-model.number="range[1]"
          type="number"
          dense
          outlined
          label="Maximum value"
          @update:model-value="adjustMinMax"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: false
  },
  showRoundTo: {
    type: Boolean,
    default: true
  },
  showNumeratorDigits: {
    type: Boolean,
    default: true
  },
  showType: {
    type: Boolean,
    default: true
  },
  showCheckbox: {
    type: Boolean,
    default: false
  }
});
const type = defineModel("type", {
  type: Object as () => GSK_NUMBER_TYPE,
  required: true
});

const range = defineModel("range", {
  type: Object as () => GSK_VARIABLE_NUMBER["rangeReal"],
  required: false
});

const showElements = defineModel("showElements", {
  type: Boolean,
  required: false,
  default: true
});

import NumberEditor from "@/components/QuestionsDraft/Variables/NumberEditor.vue";

import type {
  GSK_NUMBER_TYPE,
  GSK_VARIABLE_NUMBER
} from "@/library/types/variables";

const adjustMinMax = (val: string | number | null): void => {
  if (val === null || val === "") {
    val = 0;
  }
  // if no range, return
  if (!range || !Array.isArray(range.value) || range.value.length !== 2) {
    return;
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
