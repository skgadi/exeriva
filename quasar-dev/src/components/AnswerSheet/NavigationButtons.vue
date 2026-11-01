<template>
  <div class="row q-gutter-md items-center justify-center">
    <div class="col-auto">
      <span class="text-bold text-caption">
        {{ answerSheet.state.displayingQuestionIndex + 1 }} /
        {{ getTotalQuestionsCount(answerSheet) }}
      </span>
    </div>
    <div class="col">
      <q-slider
        class="q-mt-xs"
        v-model="answerSheet.state.displayingQuestionIndex"
        :min="0"
        :max="getTotalQuestionsCount(answerSheet) - 1"
        markers
        selection-color="transparent"
        :readonly="isSliderReadOnly"
      />
    </div>
    <div class="col-auto">
      <q-btn-group flat rounded>
        <q-btn
          color="primary"
          outline
          dense
          :disable="!isMovePreviousAllowed.allowed"
          @click="movePrevious"
          :title="isMovePreviousAllowed.reason"
          icon="chevron_left"
        />
        <q-btn
          color="primary"
          outline
          :disable="!isMoveNextAllowed.allowed"
          @click="moveNext"
          :title="isMoveNextAllowed.reason"
          icon="chevron_right"
        />
      </q-btn-group>
    </div>
  </div>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import { type PropType, computed } from "vue";
import {
  getTotalQuestionsCount,
  isCurrentQuestionAnswered
} from "@/services/app-utils/variables/answers";

/**
 * MoveNext is allowed only if the current displaying question index is less than the total questions count - 1
 * If answer sheet is submitted, then moveNext is allowed without any restriction.
 * But if the answer sheet is not submitted, then moveNext is allowed only if the current answer is answered or the settings allow skipping unanswered questions.
 *
 */
const isMoveNextAllowed = computed(() => {
  const isItPossibleToMoveNext =
    answerSheet.value.state.displayingQuestionIndex <
    getTotalQuestionsCount(answerSheet.value) - 1;
  const reasonNotPossibleToMoveNext =
    "You are at the last question, you cannot move next.";
  const moveNextAllowedText = "Show next question";
  if (answerSheet.value.state.isSubmitted) {
    return {
      allowed: isItPossibleToMoveNext,
      reason: isItPossibleToMoveNext
        ? moveNextAllowedText
        : reasonNotPossibleToMoveNext
    };
  }
  if (answerSheet.value.questionPaper.settings.allowSkippingQuestions) {
    return {
      allowed: isItPossibleToMoveNext,
      reason: isItPossibleToMoveNext
        ? moveNextAllowedText
        : reasonNotPossibleToMoveNext
    };
  }
  if (!isCurrentQuestionAnswered(answerSheet.value)) {
    return {
      allowed: false,
      reason:
        "You cannot move to the next question because the current question is not answered and skipping unanswered questions is not allowed."
    };
  }
  return {
    allowed: isItPossibleToMoveNext,
    reason: isItPossibleToMoveNext
      ? moveNextAllowedText
      : reasonNotPossibleToMoveNext
  };
});

const moveNext = () => {
  if (isMoveNextAllowed.value.allowed) {
    answerSheet.value.state.displayingQuestionIndex++;
  } else {
    alert(isMoveNextAllowed.value.reason);
  }
};

const isSliderReadOnly = computed(() => {
  if (answerSheet.value.state.isSubmitted) {
    return false;
  }
  if (
    answerSheet.value.questionPaper.settings.allowSkippingQuestions &&
    answerSheet.value.questionPaper.settings.allowSeeingPreviousAnswers
  ) {
    return false;
  }
  return true;
});

const isMovePreviousAllowed = computed(() => {
  const isItPossibleToMovePrevious =
    answerSheet.value.state.displayingQuestionIndex > 0;
  if (answerSheet.value.state.isSubmitted) {
    return {
      allowed: isItPossibleToMovePrevious,
      reason: isItPossibleToMovePrevious
        ? "Show previous question"
        : "You are at the first question, you cannot move previous."
    };
  }
  if (answerSheet.value.questionPaper.settings.allowSeeingPreviousAnswers) {
    return {
      allowed: isItPossibleToMovePrevious,
      reason: isItPossibleToMovePrevious
        ? "Show previous question"
        : "You are at the first question, you cannot move previous."
    };
  }
  return {
    allowed: false,
    reason:
      "You cannot move to the previous question because seeing previous answers is not allowed."
  };
});

const movePrevious = () => {
  if (isMovePreviousAllowed.value.allowed) {
    answerSheet.value.state.displayingQuestionIndex--;
  } else {
    alert(isMovePreviousAllowed.value.reason);
  }
};
</script>
