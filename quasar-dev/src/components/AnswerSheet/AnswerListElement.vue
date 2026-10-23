<template>
  <q-item @click="emit('click', props.answerSheet)">
    <q-item-section>
      <q-item-label>{{ answerSheet.questionPaper.shortTitle }}</q-item-label>
      <q-item-label caption>{{ answerSheet.questionPaper.title }}</q-item-label>
      <q-item-label class="text-mono" caption style="font-size: 0.7rem">
        <q-icon name="mdi-identifier" />:<span>{{ answerSheet.id }}</span>
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <template v-if="!props.answerSheet.state.isSubmitted">
        <q-circular-progress
          show-value
          :value="props.answerSheet.state.percentageFinished"
          size="30px"
          color="teal"
          track-color="grey-3"
        >
          {{ props.answerSheet.state.percentageFinished }}%
        </q-circular-progress>
      </template>
      <template v-else>
        <q-icon name="mdi-check-outline" />
      </template>
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
const props = defineProps({
  answerSheet: {
    type: Object as () => GSK_ANSWER_TO_QUESTION_PAPER,
    required: true
  }
});

const emit = defineEmits({
  click: (answerSheet: GSK_ANSWER_TO_QUESTION_PAPER) => true
});

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
</script>
