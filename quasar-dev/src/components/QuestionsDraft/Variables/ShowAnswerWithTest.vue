<template>
  <div class="q-pa-md q-gutter-md row justify-center items-start">
    <div
      style="
        min-width: 200px;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 0px;
      "
      class="row justify-center items-center bg-grey-2"
    >
      <div class="col">
        <div
          class="row items-center"
          style="height: 40px; border-bottom: 1px solid #ccc"
        >
          <div class="col text-center"> Student's view </div>
        </div>
        <div class="q-pa-xl row justify-center">
          <div v-if="variable.studentAnswer" class="text-center">
            <answering-element v-model="variable.studentAnswer" />
          </div>
        </div>
      </div>
    </div>

    <div
      style="
        min-width: 200px;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 0px;
      "
      class="row justify-center items-center bg-grey-2"
    >
      <div class="col">
        <div
          class="row items-center"
          style="height: 40px; border-bottom: 1px solid #ccc"
        >
          <div class="col text-center">
            <q-icon
              :name="isCorret ? 'mdi-check-circle-outline' : 'mdi-close-circle'"
              :color="isCorret ? 'positive' : 'negative'"
              size="sm"
              class="q-mr-sm"
            />
            Interpreted as
          </div>
        </div>
        <div class="q-pa-xs row justify-center">
          <div v-if="variable.studentAnswer" class="text-center">
            <display-tex :tex-content="`$$${interpretedStudentAnswer}$$`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const variable = defineModel({
  type: Object as () => GSK_VARIABLE_EXPRESSION,
  required: true
});

import type { GSK_VARIABLE_EXPRESSION } from "@/library/types/variables";

import AnsweringElement from "@/components/QuestionsDraft/Variables/AnsweringElement.vue";
import DisplayTex from "@/components/ExtrasForQuasar/DisplayTex.vue";

import { computed } from "vue";
import * as math from "mathjs";
import {
  interpretUserInput,
  isCorrectAnswer
} from "@/services/app-utils/variables/answers";
import { displayVariable } from "@/services/app-utils/variables/viewer";

const interpretedStudentAnswer = computed(() => {
  if (variable.value.studentAnswer) {
    const interpreted = interpretUserInput(
      variable.value.studentAnswer.studentInput
    );
    const varVal = JSON.parse(
      JSON.stringify(variable.value, math.replacer),
      math.reviver
    ) as GSK_VARIABLE_EXPRESSION;
    varVal.variableValue = interpreted;
    console.log("varVal", varVal, interpreted);
    displayVariable(varVal);
    return `${varVal.variableDisplayValue}`;
  } else {
    return "";
  }
});

const isCorret = computed(() => {
  if (variable.value.studentAnswer) {
    const varVal = JSON.parse(
      JSON.stringify(variable.value, math.replacer),
      math.reviver
    ) as GSK_VARIABLE_EXPRESSION;
    return isCorrectAnswer(varVal);
  } else {
    return false;
  }
});
</script>
