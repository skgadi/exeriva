<template>
  <div style="max-width: 1000px; margin: 0px auto">
    <div class="text-center">
      <div class="text-h6">{{ answerSheet.questionPaper.shortTitle }}</div>
      <div class="text-bold text-italic">{{
        answerSheet.questionPaper.title
      }}</div>
      <div class="text-mono text-center">
        Q<q-icon name="mdi-identifier" />:
        <span
          class="text-purple-14 bg-orange-1 q-px-sm q-py-xs rounded-borders"
          >{{ answerSheet.questionPaper.id }}</span
        >
        <copy-button
          :text-to-copy="answerSheet.questionPaper.id"
          size="xs"
          class="q-ml-sm bg-grey-2 text-grey-9"
        />
      </div>
      <div class="text-mono text-center q-mb-md">
        A<q-icon name="mdi-identifier" />:
        <span
          class="text-purple-14 bg-orange-1 q-px-sm q-py-xs rounded-borders"
          >{{ answerSheet.id }}</span
        >
        <copy-button
          :text-to-copy="answerSheet.id"
          size="xs"
          class="q-ml-sm bg-grey-2 text-grey-9"
        />
      </div>
    </div>
    <main-security-check v-model="answerSheet">
      <q-card flat class="q-pa-md q-ma-md rounded-borders">
        <view-question-element
          v-model="answerSheet.questionPaper.header"
          :read-only="answerSheet.state.isSubmitted"
        />
      </q-card>
      <q-card
        class="q-pa-md q-ma-md rounded-borders"
        bordered
        style="border-radius: 32px"
      >
        <view-question-element
          v-for="(questionElement, index) in answerSheet.questionPaper
            .questions"
          :key="index"
          v-model="answerSheet.questionPaper.questions[index]!.question"
          :read-only="answerSheet.state.isSubmitted"
        />
      </q-card>
      <q-card flat class="q-pa-md q-ma-md rounded-borders">
        <view-question-element
          v-model="answerSheet.questionPaper.footer"
          :read-only="answerSheet.state.isSubmitted"
        />
      </q-card>
      <bottom-buttons v-model="answerSheet" />
    </main-security-check>
  </div>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import MainSecurityCheck from "@/components/AnswerSheet/MainSecurityCheck.vue";
import ViewQuestionElement from "@/components/AnswerSheet/ViewQuestionElement.vue";
import BottomButtons from "@/components/AnswerSheet/BottomButtons.vue";
import CopyButton from "@/components/ExtrasForQuasar/CopyButton.vue";

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";

import { PropType } from "vue";
</script>
