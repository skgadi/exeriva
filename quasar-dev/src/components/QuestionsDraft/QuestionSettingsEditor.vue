<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md"> Question Paper Settings </div>
    <q-list dense bordered separator>
      <q-item v-for="setting in settingsDetails" :key="setting.key">
        <q-item-section>
          <q-toggle
            v-model="settings[setting.key]"
            :label="setting.label"
            :caption="setting.caption"
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup lang="ts">
const settings = defineModel("settings", {
  type: Object as () => GSK_QUESTION_PAPER_DRAFT["settings"],
  required: true
});

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";

const settingsDetails: {
  key: keyof GSK_QUESTION_PAPER_DRAFT["settings"];
  label: string;
  caption: string;
}[] = [
  {
    key: "shuffleQuestions",
    label: "Shuffle questions",
    caption: "Randomize the order of questions in the question paper"
  },
  {
    key: "maintainStrictTimeLimit",
    label: "Maintain strict time limit",
    caption:
      "Enforce the time limit for the question paper. If question doesn't set any time, it will take 60 seconds as default time limit for that question"
  },
  {
    key: "showSolutionAfterSubmission",
    label: "Show solution after submission",
    caption: "The solution is shown when the full submission is complete."
  },
  {
    key: "showAnswersAfterSubmission",
    label: "Show answers after submission",
    caption: "The answers are shown when the full submission is complete."
  },
  {
    key: "showAnswersAfterEachQuestion",
    label: "Show answers after each question  is answered",
    caption: "The answers are shown after each question is answered."
  },
  {
    key: "displayQuestionsInOnePage",
    label: "Display questions in one page",
    caption: "All questions are displayed on a single page."
  },
  {
    key: "allowChangingAnswers",
    label: "Allow changing answers",
    caption: "Users can change their answers after submitting a question."
  },
  {
    key: "allowSeeingPreviousAnswers",
    label: "Allow seeing previous answers",
    caption: "Users can see their previous answers after submitting a question."
  },
  {
    key: "finishInOneSession",
    label: "Finish in one session",
    caption:
      "Users must complete the question paper in a single session without leaving."
  },
  {
    key: "allowSkippingQuestions",
    label: "Allow skipping questions",
    caption: "Users can skip questions and return to them later."
  }
];
</script>
