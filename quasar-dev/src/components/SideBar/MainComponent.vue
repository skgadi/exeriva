<template>
  <user-viewer />
  <q-list bordered separator>
    <answers-list />
    <list-draft-questions />
  </q-list>
</template>

<script setup lang="ts">
import UserViewer from "@/components/SideBar/UserViewer.vue";
import ListDraftQuestions from "@/components/SideBar/ListDraftQuestions.vue";
import AnswersList from "@/components/SideBar/AnswersList.vue";
</script>
