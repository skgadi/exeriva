<template>
  <div style="max-width: 1000px; margin: 0px auto">
    <div class="text-center">
      <div class="text-h6">{{ answerSheet.questionPaper.shortTitle }}</div>
      <div class="text-bold text-italic">{{
        answerSheet.questionPaper.title
      }}</div>
      <div class="row justify-center q-gutter-md">
        <div class="col-auto text-mono text-center">
          Q<q-icon name="mdi-identifier" />:
          <span
            class="text-purple-14 bg-orange-1 q-px-sm q-py-xs rounded-borders"
            >{{ answerSheet.questionPaper.id }}</span
          >
          <copy-button
            :text-to-copy="answerSheet.questionPaper.id"
            size="xs"
            class="bg-grey-2 text-grey-9"
          />
        </div>
        <div class="col-auto text-mono text-center">
          A<q-icon name="mdi-identifier" />:
          <span
            class="text-purple-14 bg-orange-1 q-px-sm q-py-xs rounded-borders"
            >{{ answerSheet.id }}</span
          >
          <copy-button
            :text-to-copy="answerSheet.id"
            size="xs"
            class="bg-grey-2 text-grey-9"
          />
        </div>
      </div>
      <answer-summary v-model="answerSheet" />
    </div>
    <main-security-check v-model="answerSheet">
      <q-card class="q-my-md rounded-borders bg-grey-2" bordered>
        <q-card flat class="q-pa-md rounded-borders bg-grey-2" bordered>
          <view-question-element
            v-model="answerSheet.questionPaper.header"
            :read-only="answerSheet.state.isSubmitted"
          />
        </q-card>
        <q-card flat class="q-pa-md rounded-borders" bordered>
          <answering-main v-model="answerSheet" />
        </q-card>
        <q-card flat class="q-pa-md rounded-borders bg-grey-2" bordered>
          <view-question-element
            v-model="answerSheet.questionPaper.footer"
            :read-only="answerSheet.state.isSubmitted"
          />
        </q-card>
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
import AnsweringMain from "@/components/AnswerSheet/AnsweringMain.vue";
import BottomButtons from "@/components/AnswerSheet/BottomButtons.vue";
import CopyButton from "@/components/ExtrasForQuasar/CopyButton.vue";
import AnswerSummary from "@/components/AnswerSheet/AnswerSummary.vue";

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";

import { PropType } from "vue";
</script>
