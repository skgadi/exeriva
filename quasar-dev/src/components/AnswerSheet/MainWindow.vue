<template>
  <main-security-check v-model="answerSheet">
    <q-card class="q-pa-md" style="max-width: 1000px; margin: 32px auto">
      <view-question-element
        v-model="answerSheet.questionPaper.header"
        :read-only="answerSheet.state.isSubmitted"
      />
      <hr class="q-my-lg" />
      <view-question-element
        v-for="(questionElement, index) in answerSheet.questionPaper.questions"
        :key="index"
        v-model="answerSheet.questionPaper.questions[index]!.question"
        :read-only="answerSheet.state.isSubmitted"
      />
      <hr class="q-my-lg" />
      <view-question-element
        v-model="answerSheet.questionPaper.footer"
        :read-only="answerSheet.state.isSubmitted"
      />
    </q-card>
    <bottom-buttons v-model="answerSheet" />
  </main-security-check>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import MainSecurityCheck from "@/components/AnswerSheet/MainSecurityCheck.vue";
import ViewQuestionElement from "@/components/AnswerSheet/ViewQuestionElement.vue";
import BottomButtons from "@/components/AnswerSheet/BottomButtons.vue";

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";

import { PropType } from "vue";
</script>
