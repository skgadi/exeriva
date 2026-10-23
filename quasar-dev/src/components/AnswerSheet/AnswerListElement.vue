<template>
  <q-item @click="emit('click', props.answerSheet)">
    <q-item-section>
      <div class="text-h6"
        >{{ props.answerSheet.questionPaper.shortTitle }}
      </div>
      <div class="text-subtitle2"> {{ props.answerSheet.studentName }} </div>
      <div class="text-subtitle2">
        {{
          props.answerSheet.state.isSubmitted ? "Submitted" : "Not Submitted"
        }}
      </div>
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
