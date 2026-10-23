<template>
  <q-input
    outlined
    dense
    v-model="studentAnswer.studentInput"
    class="inline-answer-input"
    input-class="text-right"
    :style="getOuterStyleFromInputStyle(studentAnswer.style)"
    :input-style="getInnerStyleFromInputStyle(studentAnswer.style)"
  />
</template>
<script setup lang="ts">
const studentAnswer = defineModel({
  type: Object as () => GSK_STUDENT_ANSWER,
  required: true
});

import type { GSK_STUDENT_ANSWER } from "@/library/types/variables";
import {
  getOuterStyleFromInputStyle,
  getInnerStyleFromInputStyle
} from "@/services/app-utils/variables/styles";
</script>
