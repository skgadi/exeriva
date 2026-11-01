<template>
  <template v-if="answerSheet.questionPaper.settings.displayQuestionsInOnePage">
    <view-question-element
      v-for="(questionElement, index) in answerSheet.questionPaper.questions"
      :key="index"
      v-model="answerSheet.questionPaper.questions[index]!.question"
      :read-only="answerSheet.state.isSubmitted"
    />
  </template>
  <template v-else>
    <template v-if="answerSheet.state.displayingQuestionIndex > -1">
      <view-question-element
        v-model="
          answerSheet.questionPaper.questions[
            answerSheet.state.displayingQuestionIndex
          ]!.question
        "
        :read-only="answerSheet.state.isSubmitted"
      />
    </template>
    <template v-else>
      <div class="text-center q-pa-md">
        <q-btn
          label="Start answering"
          color="positive"
          no-caps
          rounded
          icon="mdi-play-circle-outline"
          size="lg"
          outline
          @click="answerSheet.state.displayingQuestionIndex = 0"
        />
      </div>
    </template>
  </template>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import ViewQuestionElement from "@/components/AnswerSheet/ViewQuestionElement.vue";

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import { PropType } from "vue";
</script>
