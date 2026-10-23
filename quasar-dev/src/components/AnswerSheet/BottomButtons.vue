<template>
  <div class="q-gutter-md text-center">
    <q-btn
      :disable="answerSheet.state.isSubmitted"
      push
      no-caps
      color="primary"
      label="Submit answer sheet"
      icon="mdi-send-outline"
      @click="submitAnswerSheet(answerSheet)"
    />
  </div>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import { PropType } from "vue";
import { submitAnswerSheet } from "@/services/app-utils/variables/submission";
</script>
