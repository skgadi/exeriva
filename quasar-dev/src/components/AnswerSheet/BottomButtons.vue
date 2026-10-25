<template>
  <div class="q-gutter-md text-center">
    <template v-if="answerSheet.state.isSubmitted">
      <div class="q-mb-md">
        You have obtained a grade of:
        {{ answerSheet.state.gradeInPercentage }}%
      </div>
    </template>
    <template v-else>
      <q-btn
        :disable="answerSheet.state.isSubmitted"
        push
        no-caps
        color="primary"
        label="Submit answer sheet"
        icon="mdi-send-outline"
        @click="submitAnswerSheet(answerSheet)"
      />
      <q-btn
        :disable="answerSheet.state.isSubmitted"
        push
        no-caps
        color="secondary"
        label="Show Scratchpad"
        icon="mdi-pencil"
        @click="showScratchpad = true"
      />
    </template>
  </div>
  <q-dialog v-model="showScratchpad" persistent>
    <ScratchPad />
  </q-dialog>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});
import ScratchPad from "@/components/ExtrasForQuasar/ScratchPad.vue";

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import { type PropType, ref } from "vue";
import { submitAnswerSheet } from "@/services/app-utils/variables/submission";

const showScratchpad = ref(false);
</script>
