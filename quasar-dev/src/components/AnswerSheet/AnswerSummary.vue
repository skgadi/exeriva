<template>
  <div class="row justify-center q-gutter-md">
    <div class="col-auto">
      <q-chip>
        <q-avatar color="red" text-color="white">
          {{ getTotalQuestionsCount(answerSheet) }}
        </q-avatar>
        Total Questions
      </q-chip>
      <percentage-advance
        title="Viewed"
        :percentage="answerSheet.state.percentageSeen"
        color="green"
      />
      <percentage-advance
        title="Answered"
        :percentage="answerSheet.state.percentageAnswered"
        color="blue"
      />
      <percentage-advance
        title="Solution viewed"
        :percentage="answerSheet.state.percentageSolutionSeen"
        color="purple"
      />
      <percentage-advance
        v-if="answerSheet.state.isSubmitted"
        title="Grade"
        :percentage="answerSheet.state.gradeInPercentage"
        :color="
          answerSheet.state.gradeInPercentage >= 80
            ? 'positive'
            : answerSheet.state.gradeInPercentage >= 50
              ? 'warning'
              : 'negative'
        "
      />
      <q-chip>
        <q-avatar color="orange" text-color="white">
          {{ getSessionCount(answerSheet) }}
        </q-avatar>
        Sessions
      </q-chip>
    </div>
  </div>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import PercentageAdvance from "@/components/AnswerSheet/PercentageAdvance.vue";

import { type PropType } from "vue";
import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import {
  getTotalQuestionsCount,
  getSessionCount
} from "@/services/app-utils/variables/answers";
</script>
