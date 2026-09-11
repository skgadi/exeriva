<template>
  <user-viewer />
  <q-list bordered>
    <list-draft-questions show-short-titles />
  </q-list>
</template>

<script setup lang="ts">
import UserViewer from "@/components/SideBar/UserViewer.vue";
import ListDraftQuestions from "@/components/SideBar/ListDraftQuestions.vue";
</script>
