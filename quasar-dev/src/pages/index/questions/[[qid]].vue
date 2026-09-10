<template>
  {{ qid }}
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const qid = (route.params as { qid: string }).qid;
</script>
