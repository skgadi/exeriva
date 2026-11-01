<template>
  <div class="row q-gutter-md items-center justify-center">
    <div class="col">
      <navigation-buttons v-model="answerSheet" />
    </div>
    <div
      class="col-auto"
      v-if="
        !answerSheet.questionPaper.settings.finishInOneSession ||
        answerSheet.state.isSubmitted
      "
    >
      <q-btn
        flat
        dense
        no-caps
        color="warning"
        title="Close this session"
        icon="mdi-close-circle-outline"
        to="/answers/"
      />
    </div>
    <div class="col-auto">
      <q-btn
        :disable="answerSheet.state.isSubmitted"
        flat
        dense
        no-caps
        color="positive"
        title="Submit this answer sheet"
        icon="mdi-send-outline"
        @click="submit"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import NavigationButtons from "@/components/AnswerSheet/NavigationButtons.vue";

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import { type PropType } from "vue";
import { submitAnswerSheet } from "@/services/app-utils/variables/submission";
const submit = () => {
  if (confirm("Are you sure you want to submit this answer sheet?")) {
    submitAnswerSheet(answerSheet.value);
  }
};
</script>
