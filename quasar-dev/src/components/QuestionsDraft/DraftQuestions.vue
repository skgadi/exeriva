<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md"> Questions </div>
    <q-markup-table
      bordered
      class=""
      style="width: fit-content; margin: auto"
      dense
      flat
    >
      <tbody>
        <tr>
          <td class="text-subtitle2 text-right">Total questions</td>
          <td class="text-subtitle2 text-center">:</td>
          <td class="text-subtitle2"
            >{{ getTotalQuestions(questions) }}
            <q-btn
              dense
              round
              size="sm"
              no-caps
              flat
              class="q-px-md q-mr-sm"
              color="primary"
              title="Add a question"
              icon="mdi-plus"
              @click="addAQuestion"
          /></td>
        </tr>
        <tr>
          <td class="text-subtitle2 text-right">Total credits</td>
          <td class="text-subtitle2 text-center">:</td>
          <td class="text-subtitle2">{{ getTotalCredits(questions) }}</td>
        </tr>
        <tr>
          <td class="text-subtitle2 text-right">Total expected time</td>
          <td class="text-subtitle2 text-center">:</td>
          <td class="text-subtitle2">{{
            convertTimeInSecondsToHMS(getTotalExpectedTime(questions))
          }}</td>
        </tr>
        <tr>
          <td class="text-subtitle2 text-right">Shuffle questions</td>
          <td class="text-subtitle2 text-center">:</td>
          <td class="text-subtitle2">
            <q-toggle
              v-model="settings.shuffleQuestions"
              dense
              color="primary"
              label-position="left"
            />
          </td>
        </tr>
        <tr>
          <td class="text-subtitle2 text-right">Maintain strict time limit</td>
          <td class="text-subtitle2 text-center">:</td>
          <td class="text-subtitle2">
            <q-toggle
              v-model="settings.maintainStrictTimeLimit"
              dense
              color="primary"
              label-position="left"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <template v-for="(question, index) in questions" :key="index">
      <draft-question
        v-model="questions[index]!"
        :question-index="index"
        :questions-length="questions.length"
        @move-up="moveQuestionUp"
        @move-down="moveQuestionDown"
        @delete="removeAQuestion"
        @duplicate="duplicateQuestion"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
const questions = defineModel("questions", {
  type: Object as () => GSK_QUESTION_PAPER_DRAFT["questions"],
  required: true
});

const settings = defineModel("settings", {
  type: Object as () => GSK_QUESTION_PAPER_DRAFT["settings"],
  required: true
});

import DraftQuestion from "@/components/QuestionsDraft/DraftQuestion.vue";

import type { GSK_QUESTION_PAPER_DRAFT } from "@/library/types/questions";
import {
  getTotalQuestions,
  getTotalExpectedTime,
  getTotalCredits
} from "@/services/app-utils/variables/questions";
import { convertTimeInSecondsToHMS } from "@/services/app-utils/common/date-time";
import * as math from "mathjs";

const addAQuestion = () => {
  questions.value.push({
    question: {
      text: "",
      variables: [],
      numberOfRepeats: 1
    },
    solution: {
      text: "",
      variables: [],
      numberOfRepeats: 1
    }
  });
};

const removeAQuestion = (index: number) => {
  const confirmation = window.confirm(
    "Are you sure you want to delete this question?"
  );
  if (!confirmation) return;
  questions.value.splice(index, 1);
};

const moveQuestionUp = (index: number) => {
  if (index > 0) {
    const temp = questions.value[index];
    questions.value[index] = questions.value[index - 1]!;
    questions.value[index - 1] = temp!;
  }
};

const moveQuestionDown = (index: number) => {
  if (index < questions.value.length - 1) {
    const temp = questions.value[index];
    questions.value[index] = questions.value[index + 1]!;
    questions.value[index + 1] = temp!;
  }
};

const duplicateQuestion = (index: number) => {
  const questionToDuplicate = questions.value[index];
  const duplicatedQuestion = JSON.parse(
    JSON.stringify(questionToDuplicate, math.replacer),
    math.reviver
  );
  questions.value.splice(index + 1, 0, duplicatedQuestion);
};
</script>
