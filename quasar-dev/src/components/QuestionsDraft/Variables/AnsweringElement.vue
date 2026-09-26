<template>
  <q-input
    outlined
    dense
    v-model="studentAnswer.studentInput"
    input-class="text-right"
    style="height: 25px; width: 100px; margin: 0px; padding: 0px"
    :style="studentAnswer.inputStyle"
  />
</template>
<script setup lang="ts">
const studentAnswer = defineModel({
  type: Object as () => GSK_STUDENT_ANSWER,
  required: true
});

import type { GSK_STUDENT_ANSWER } from "@/library/types/variables";
</script>
