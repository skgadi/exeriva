<template>
  <template v-if="!hasRightToViewAnswerSheet">
    <div class="useful-width q-px-md q-pt-xl q-pb-lg">
      <div class="q-gutter-md row justify-center">
        You are not allowed to view this answer sheet. Please make sure you are
        logged in with the correct user to continue to answer this question
        paper.
      </div>
    </div>
  </template>
  <template v-else-if="!isPasswordMatching">
    <div class="useful-width q-px-md q-pt-xl q-pb-lg">
      <div class="q-gutter-md row justify-center">
        <password-input
          v-model="passwordToViewAnswerSheet"
          label="Enter password to view this answer sheet"
          icon="mdi-lock-outline"
        />
      </div>
    </div>
  </template>
  <template v-else>
    <slot />
  </template>
</template>
<script setup lang="ts">
const answerSheet = defineModel({
  type: Object as PropType<GSK_ANSWER_TO_QUESTION_PAPER>,
  required: true
});

import PasswordInput from "@/components/ExtrasForQuasar/PasswordInput.vue";

import type { GSK_ANSWER_TO_QUESTION_PAPER } from "@/library/types/answers";
import type { PropType } from "vue";
import { useUsersStore } from "@/stores/users-settings";
import { ref, computed } from "vue";

const usersStore = useUsersStore();
const isSameUser = computed(() => {
  if (usersStore.selectedUser === null) return false;
  if (!answerSheet.value.studentName) return false;
  return answerSheet.value.studentName === usersStore.selectedUser;
});

const hasRightToViewAnswerSheet = computed(() => {
  if (isSameUser.value) return true;
  //If it is already submitted, then anyone can view it
  if (answerSheet.value.state.isSubmitted) return true;
  //If it is not submitted, then only the user who created it can view it
  return false;
});

const passwordToViewAnswerSheet = ref<string>("");

const isPasswordMatching = computed(() => {
  if (!answerSheet.value.questionPaper.access.answerPassword) return true;
  return (
    passwordToViewAnswerSheet.value ===
    answerSheet.value.questionPaper.access.answerPassword
  );
});
</script>
