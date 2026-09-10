<template>
  <user-viewer />
  <q-list bordered>
    <q-item clickable v-ripple>
      <q-item-section avatar>
        <q-icon name="mdi-file-question-outline" />
      </q-item-section>
      <q-item-section>Prepare questions</q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import UserViewer from "@/components/SideBar/UserViewer.vue";
</script>
